-- ==========================================================
-- CodeLens AI Sample File: Analytics & Window Functions
-- Language: SQL (.sql)
-- ==========================================================

-- CTE 1: Compute aggregated metrics per repository author over the last 30 days
WITH MonthlyContributions AS (
    SELECT 
        u.id AS author_id,
        u.username,
        u.email,
        u.department,
        COUNT(c.id) AS total_commits,
        SUM(c.additions) AS total_lines_added,
        SUM(c.deletions) AS total_lines_deleted,
        SUM(c.additions - c.deletions) AS net_code_growth
    FROM users u
    INNER JOIN commits c ON u.id = c.author_id
    WHERE c.created_at >= NOW() - INTERVAL '30 days'
      AND u.is_active = TRUE
    GROUP BY u.id, u.username, u.email, u.department
),

-- CTE 2: Calculate rankings and department moving averages
DepartmentRankings AS (
    SELECT 
        author_id,
        username,
        email,
        department,
        total_commits,
        net_code_growth,
        DENSE_RANK() OVER (
            PARTITION BY department 
            ORDER BY total_commits DESC
        ) AS dept_rank,
        AVG(total_commits) OVER (
            PARTITION BY department
        ) AS dept_avg_commits
    FROM MonthlyContributions
)

-- Final Output Query
SELECT 
    author_id,
    username,
    department,
    total_commits,
    net_code_growth,
    dept_rank,
    ROUND(dept_avg_commits, 2) AS dept_average_commits,
    CASE 
        WHEN total_commits >= (dept_avg_commits * 1.5) THEN 'Top Contributor'
        WHEN total_commits >= dept_avg_commits THEN 'Above Average'
        ELSE 'Needs Attention'
    END AS contribution_status
FROM DepartmentRankings
ORDER BY department ASC, dept_rank ASC;
