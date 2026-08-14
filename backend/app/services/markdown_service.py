from datetime import datetime
from app.schemas.analysis import AnalysisResult

class MarkdownService:
    @staticmethod
    def generate_analysis_markdown(title: str, language: str, source_code: str, analysis: AnalysisResult) -> str:
        date_str = datetime.utcnow().strftime("%Y-%m-%d %H:%M UTC")
        
        md_lines = [
            f"# {title or 'CodeLens AI Analysis Report'}",
            f"",
            f"> **Language:** `{language.upper()}` | **Generated:** {date_str} | **Overall Quality:** {analysis.quality.score}/100",
            f"",
            f"---",
            f"",
            f"## 📌 Executive Summary",
            f"",
            f"**Purpose:** {analysis.purpose}",
            f"",
            f"**Summary:** {analysis.summary}",
            f"",
        ]

        if analysis.key_components:
            md_lines.append("### Key Components")
            for comp in analysis.key_components:
                md_lines.append(f"- {comp}")
            md_lines.append("")

        md_lines.extend([
            f"---",
            f"",
            f"## 📊 Code Quality & Complexity",
            f"",
            f"| Metric | Value |",
            f"| :--- | :--- |",
            f"| **Overall Score** | **{analysis.quality.score}/100** |",
            f"| Readability | {analysis.quality.readability}/100 |",
            f"| Maintainability | {analysis.quality.maintainability}/100 |",
            f"| Efficiency | {analysis.quality.efficiency}/100 |",
            f"| Security Rating | {analysis.quality.security}/100 |",
            f"| **Time Complexity** | **{analysis.complexity.time}** |",
            f"| **Space Complexity** | **{analysis.complexity.space}** |",
            f"",
            f"**Complexity Analysis:** {analysis.complexity.explanation}",
            f"",
        ])

        # Bugs
        md_lines.extend([
            f"---",
            f"",
            f"## 🐛 Bug & Logic Analysis ({len(analysis.bugs)} findings)",
            f"",
        ])
        if analysis.bugs:
            for i, bug in enumerate(analysis.bugs, 1):
                md_lines.extend([
                    f"### {i}. [{bug.severity.upper()}] {bug.title}",
                    f"- **Location:** `{bug.location or 'N/A'}`",
                    f"- **Description:** {bug.description}",
                    f"- **Recommendation:** {bug.recommendation}",
                    f"",
                ])
        else:
            md_lines.append("✅ No critical syntax or logic bugs detected.\n")

        # Security
        md_lines.extend([
            f"---",
            f"",
            f"## 🛡️ Security Vulnerabilities ({len(analysis.security_issues)} findings)",
            f"",
        ])
        if analysis.security_issues:
            for i, sec in enumerate(analysis.security_issues, 1):
                md_lines.extend([
                    f"### {i}. [{sec.severity.upper()}] {sec.title}",
                    f"- **Location:** `{sec.location or 'N/A'}`",
                    f"- **Risk:** {sec.risk}",
                    f"- **Explanation:** {sec.explanation}",
                    f"- **Remediation:** {sec.recommendation}",
                    f"",
                ])
        else:
            md_lines.append("✅ No immediate security vulnerabilities detected.\n")

        # Optimizations
        if analysis.optimizations:
            md_lines.extend([
                f"---",
                f"",
                f"## ⚡ Optimization Opportunities",
                f"",
            ])
            for i, opt in enumerate(analysis.optimizations, 1):
                md_lines.extend([
                    f"### {i}. {opt.problem}",
                    f"- **Current Approach:** {opt.current_approach}",
                    f"- **Recommended Approach:** {opt.recommended_approach}",
                    f"- **Expected Benefit:** {opt.expected_benefit}",
                    f"",
                ])

        # Code explanation breakdown
        if analysis.explanation:
            md_lines.extend([
                f"---",
                f"",
                f"## 🔍 Code Block Breakdown",
                f"",
            ])
            for block in analysis.explanation:
                lines_tag = f" (`{block.lines}`)" if block.lines else ""
                md_lines.extend([
                    f"#### {block.title}{lines_tag}",
                    f"{block.explanation}",
                    f"",
                ])

        # Original source code
        md_lines.extend([
            f"---",
            f"",
            f"## 💻 Original Source Code",
            f"",
            f"```{language}",
            f"{source_code}",
            f"```",
            f"",
        ])

        # Refactored code
        if analysis.refactored_code:
            md_lines.extend([
                f"---",
                f"",
                f"## ✨ Refactored Implementation",
                f"",
                f"```{language}",
                f"{analysis.refactored_code}",
                f"```",
                f"",
            ])

        # Documentation if generated
        if analysis.documentation:
            md_lines.extend([
                f"---",
                f"",
                f"## 📖 Generated Documentation",
                f"",
                f"{analysis.documentation}",
                f"",
            ])

        return "\n".join(md_lines)

markdown_service = MarkdownService()
