import io
from datetime import datetime
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Preformatted, KeepTogether, HRFlowable
)
from app.schemas.analysis import AnalysisResult

class PDFService:
    @staticmethod
    def generate_analysis_pdf(title: str, language: str, source_code: str, analysis: AnalysisResult) -> bytes:
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(
            buffer,
            pagesize=letter,
            rightMargin=36,
            leftMargin=36,
            topMargin=36,
            bottomMargin=36
        )
        
        styles = getSampleStyleSheet()
        
        # Custom palette
        primary_color = colors.HexColor("#0f172a") # Slate 900
        accent_color = colors.HexColor("#4338ca")  # Indigo 700
        text_dark = colors.HexColor("#1e293b")
        text_muted = colors.HexColor("#64748b")
        bg_light = colors.HexColor("#f8fafc")
        border_color = colors.HexColor("#e2e8f0")

        # Custom typography styles
        title_style = ParagraphStyle(
            'DocTitle',
            parent=styles['Heading1'],
            fontName='Helvetica-Bold',
            fontSize=22,
            leading=26,
            textColor=primary_color,
            spaceAfter=4
        )
        
        subtitle_style = ParagraphStyle(
            'DocSubtitle',
            parent=styles['Normal'],
            fontName='Helvetica',
            fontSize=10,
            leading=14,
            textColor=text_muted,
            spaceAfter=12
        )

        h2_style = ParagraphStyle(
            'SectionHeading',
            parent=styles['Heading2'],
            fontName='Helvetica-Bold',
            fontSize=13,
            leading=17,
            textColor=accent_color,
            spaceBefore=12,
            spaceAfter=6
        )

        body_style = ParagraphStyle(
            'DocBody',
            parent=styles['Normal'],
            fontName='Helvetica',
            fontSize=9.5,
            leading=14,
            textColor=text_dark,
            spaceAfter=6
        )

        badge_style = ParagraphStyle(
            'BadgeText',
            parent=styles['Normal'],
            fontName='Helvetica-Bold',
            fontSize=8.5,
            leading=11,
            textColor=colors.white
        )

        code_style = ParagraphStyle(
            'CodeStyle',
            parent=styles['Code'],
            fontName='Courier',
            fontSize=8,
            leading=10.5,
            textColor=colors.HexColor("#0f172a")
        )

        story = []

        # 1. Header
        story.append(Paragraph(f"CodeLens AI &mdash; Code Analysis Report", subtitle_style))
        story.append(Paragraph(title or "Untitled Analysis", title_style))
        created_str = datetime.utcnow().strftime("%B %d, %Y - %H:%M UTC")
        meta_text = f"<b>Language:</b> {language.upper()} &nbsp;|&nbsp; <b>Generated:</b> {created_str} &nbsp;|&nbsp; <b>Quality Score:</b> {analysis.quality.score}/100"
        story.append(Paragraph(meta_text, subtitle_style))
        story.append(HRFlowable(width="100%", thickness=1, color=border_color, spaceBefore=4, spaceAfter=12))

        # 2. Executive Summary & Purpose
        story.append(Paragraph("Executive Summary", h2_style))
        story.append(Paragraph(f"<b>Purpose:</b> {analysis.purpose}", body_style))
        story.append(Paragraph(f"<b>Summary:</b> {analysis.summary}", body_style))
        
        if analysis.key_components:
            components_bullets = "<br/>".join([f"&bull; {comp}" for comp in analysis.key_components])
            story.append(Paragraph(f"<b>Key Components:</b><br/>{components_bullets}", body_style))
        story.append(Spacer(1, 8))

        # 3. Quality & Complexity Metrics Table
        story.append(Paragraph("Quality & Algorithmic Complexity", h2_style))
        
        metrics_data = [
            [
                Paragraph("<b>Overall Quality</b>", body_style),
                Paragraph(f"<b>{analysis.quality.score}/100</b>", body_style),
                Paragraph("<b>Time Complexity</b>", body_style),
                Paragraph(f"<b>{analysis.complexity.time}</b>", body_style),
            ],
            [
                Paragraph("Readability", body_style),
                Paragraph(f"{analysis.quality.readability}/100", body_style),
                Paragraph("Space Complexity", body_style),
                Paragraph(f"{analysis.complexity.space}", body_style),
            ],
            [
                Paragraph("Maintainability", body_style),
                Paragraph(f"{analysis.quality.maintainability}/100", body_style),
                Paragraph("Security Rating", body_style),
                Paragraph(f"{analysis.quality.security}/100", body_style),
            ]
        ]
        
        metrics_table = Table(metrics_data, colWidths=[1.75*inch, 1.0*inch, 1.75*inch, 1.5*inch])
        metrics_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), bg_light),
            ('GRID', (0, 0), (-1, -1), 0.5, border_color),
            ('PADDING', (0, 0), (-1, -1), 6),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ]))
        story.append(metrics_table)
        story.append(Spacer(1, 4))
        story.append(Paragraph(f"<b>Complexity Reasoning:</b> {analysis.complexity.explanation}", body_style))
        story.append(Spacer(1, 8))

        # 4. Bugs and Logic Findings
        if analysis.bugs:
            story.append(Paragraph(f"Bug Detection ({len(analysis.bugs)} found)", h2_style))
            bug_rows = [["Severity", "Finding", "Recommendation"]]
            for bug in analysis.bugs:
                sev_color = "#dc2626" if bug.severity.lower() == "critical" else "#ea580c" if bug.severity.lower() == "high" else "#d97706"
                bug_rows.append([
                    Paragraph(f"<font color='{sev_color}'><b>{bug.severity.upper()}</b></font><br/><font size='7'>{bug.location or ''}</font>", body_style),
                    Paragraph(f"<b>{bug.title}</b><br/>{bug.description}", body_style),
                    Paragraph(bug.recommendation, body_style)
                ])
            bug_table = Table(bug_rows, colWidths=[1.1*inch, 2.7*inch, 2.7*inch])
            bug_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#f1f5f9")),
                ('GRID', (0, 0), (-1, -1), 0.5, border_color),
                ('PADDING', (0, 0), (-1, -1), 5),
                ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ]))
            story.append(bug_table)
            story.append(Spacer(1, 8))

        # 5. Security Vulnerability Analysis
        if analysis.security_issues:
            story.append(Paragraph(f"Security Vulnerabilities ({len(analysis.security_issues)} found)", h2_style))
            sec_rows = [["Severity", "Vulnerability & Risk", "Remediation"]]
            for sec in analysis.security_issues:
                sev_color = "#dc2626" if sec.severity.lower() == "critical" else "#ea580c" if sec.severity.lower() == "high" else "#d97706"
                sec_rows.append([
                    Paragraph(f"<font color='{sev_color}'><b>{sec.severity.upper()}</b></font><br/><font size='7'>{sec.location or ''}</font>", body_style),
                    Paragraph(f"<b>{sec.title}</b><br/><b>Risk:</b> {sec.risk}<br/>{sec.explanation}", body_style),
                    Paragraph(sec.recommendation, body_style)
                ])
            sec_table = Table(sec_rows, colWidths=[1.1*inch, 2.7*inch, 2.7*inch])
            sec_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#f1f5f9")),
                ('GRID', (0, 0), (-1, -1), 0.5, border_color),
                ('PADDING', (0, 0), (-1, -1), 5),
                ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ]))
            story.append(sec_table)
            story.append(Spacer(1, 8))

        # 6. Optimization Suggestions
        if analysis.optimizations:
            story.append(Paragraph("Optimization Recommendations", h2_style))
            opt_rows = [["Problem Identified", "Current vs Recommended", "Expected Benefit"]]
            for opt in analysis.optimizations:
                opt_rows.append([
                    Paragraph(f"<b>{opt.problem}</b>", body_style),
                    Paragraph(f"<b>Current:</b> {opt.current_approach}<br/><b>Recommended:</b> {opt.recommended_approach}", body_style),
                    Paragraph(opt.expected_benefit, body_style)
                ])
            opt_table = Table(opt_rows, colWidths=[1.8*inch, 3.0*inch, 1.7*inch])
            opt_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#f1f5f9")),
                ('GRID', (0, 0), (-1, -1), 0.5, border_color),
                ('PADDING', (0, 0), (-1, -1), 5),
                ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ]))
            story.append(opt_table)
            story.append(Spacer(1, 8))

        # 7. Code Explanation Blocks
        if analysis.explanation:
            story.append(Paragraph("Logical Code-Block Breakdown", h2_style))
            for block in analysis.explanation:
                lines_info = f" ({block.lines})" if block.lines else ""
                story.append(Paragraph(f"<b>&bull; {block.title}{lines_info}</b>", body_style))
                story.append(Paragraph(block.explanation, body_style))
            story.append(Spacer(1, 8))

        # 8. Source Code Snippet
        story.append(Paragraph("Original Source Code", h2_style))
        # Limit preview if extremely long to keep PDF neat
        code_preview = source_code if len(source_code) < 3000 else source_code[:3000] + "\n\n... [truncated for PDF report length] ..."
        story.append(Preformatted(code_preview, code_style))
        story.append(Spacer(1, 8))

        # 9. Refactored Code if available
        if analysis.refactored_code:
            story.append(Paragraph("Refactored / Optimized Implementation", h2_style))
            refactored_preview = analysis.refactored_code if len(analysis.refactored_code) < 3000 else analysis.refactored_code[:3000] + "\n\n... [truncated] ..."
            story.append(Preformatted(refactored_preview, code_style))

        # Build PDF document
        doc.build(story)
        pdf_bytes = buffer.getvalue()
        buffer.close()
        return pdf_bytes

pdf_service = PDFService()
