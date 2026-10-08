School Database System Design

Table Explanations

- `students`: Stores individual profile information for each student, including a unique email address to prevent duplicate records.
- `courses`: Stores available classes offered by the school, identified by a unique course code and title.
- `enrolments`: Acts as a junction table connecting students to courses. It tracks the relationship and stores additional contextual data: the student's grade.

Relationships & The Join Table

- Student to Enrolments (One-to-Many): One student can register for multiple course enrolments.
- Course to Enrolments (One-to-Many): One course can have multiple student enrolments.
- Student to Courses (Many-to-Many): Because a single student can take many courses, and a single course can have many students, a direct relationship cannot fit cleanly into a flat table structure. Therefore, a join table (`enrolments`) is required to bridge the two entities cleanly and enforce relational integrity using foreign keys. Additionally, a composite `UNIQUE(student_id, course_id)` constraint prevents a student from enrolling in the exact same course twice.
git add day6/
Recommended Database Index

- Index: `CREATE INDEX idx_enrolments_student ON enrolments(student_id);`
- Reason: In a school system, queries frequently search or join the `enrolments` table by `student_id` to look up report cards, schedules, or historical records. Adding an index on `student_id` drastically speeds up search and lookup times during `JOIN` operations.

SQL vs. NoSQL Decision
For a school management system handling students, courses, and structured academic grades, SQL (Relational Database) is the ideal choice. Academic data relies heavily on strict schema enforcement, relational integrity (ensuring foreign keys point to real students and courses), unique constraints (such as emails and preventing duplicate enrolments), and complex reporting queries involving multi-table joins and aggregations (`GROUP BY`). NoSQL databases are better suited for unstructured data or rapid, schema-less scaling, whereas a school database prioritizes data accuracy, transactional consistency (ACID), and structured relationships.
