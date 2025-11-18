📚 Simplified Course Management System
This is a single-page React application designed for basic CRUD (Create, Read, Update, Delete) operations to manage course types, courses, offerings (combinations), and student enrollment. All data is persisted locally in the browser's Local Storage.

✨ Features
Four-Step Data Flow: Enforces a logical dependency chain for data entry.

Persistent Storage: Data is saved in the browser and remains available upon refreshing.

Granular Student Management: Separate steps for student registration and course mapping (enrollment).

Verbose Mapping: Clear dropdown labels in the mapping modal showing the full "Course Type: [Type] - Course Name: [Name]".

Course Offering Filter: Ability to filter offerings by Course Type and Course Name.

🚀 Setup and Running the Application
This application is built using React and styled with React-Bootstrap.

Prerequisites
You need Node.js and npm (or Yarn) installed on your machine.

Installation Steps
Clone the Repository:

Bash

git clone [YOUR REPO URL HERE]
cd simplified-course-manager
Install Dependencies:

Bash

npm install
# or
# yarn install
Run the Application:

Bash

npm start
# or
# yarn start
The application will open automatically in your browser at http://localhost:3000.

💻 Application Workflow: The Four Steps
The application is structured into four main tabs, which must be completed in order, as each step depends on the data created in the previous one.

1. Course Types (e.g., Individual, Group)
Purpose: Define the general categories or format of courses.

Action: Click "Add Course Type" and enter names like Individual, Group, Online, or In-Person.

Data Fields: ID, Name.

2. Courses (e.g., English, Hindi)
Purpose: Define the subject names.

Action: Click "Add Course" and enter names like English, Hindi, Mathematics, etc.

Data Fields: ID, Name.

3. Course Offerings (The Combinations)
Purpose: Create sellable packages by combining a Course Type with a Course Name (e.g., Individual - English).

Action: Click "Add Offering" and select items from the dropdowns created in steps 1 and 2.

Filter: Use the filter dropdowns at the top of the table to quickly locate specific offerings.

Data Fields: ID, Course Type ID, Course ID.

4. Students & Mapping (Registration and Enrollment)
This section handles the student lifecycle in three distinct actions:

A. Registering a Student
Click "Register New Student".

Enter the student's Name and Email.

Mapping is done separately; this modal only handles basic registration.

B. Viewing Student Status
Click the <FaEye /> View button next to a student.

The modal displays the student's current enrollment status:

Course Joined: [Course Type] - [Course Name] (If mapped)

Course Joined: Not Admitted yet (If not mapped)

C. Mapping/Updating Enrollment
Click the <FaMapMarkedAlt /> Map button next to a student.

Crucial Feature: The "Map to Course Offering" dropdown shows the verbose format, making selection unambiguous:

Course Type: Individual - Course Name: English

Select the desired offering to enroll the student, or select the first option ("Unmap / Select Offering") to remove them from a course.
