
# Installation Guide

## 1. Installation of Visual Studio Code (VS Code)

### 1.1. Download and Install VS Code

- Go to the official [VS Code website](https://code.visualstudio.com/).
- Download the version corresponding to your operating system (Windows, macOS, or Linux).
- Follow the installation instructions to install VS Code on your computer.

### 1.2. Add Necessary Extensions

- Open VS Code once the installation is complete.
- Go to the Extensions section by clicking on the Extensions icon in the left sidebar or by using the shortcut `Ctrl + Shift + X`.
- Search and install the **Java Extension Pack**:
  - Type "Java Extension Pack" in the search bar and click "Install".
  - This pack includes several useful extensions for Java development.
- Search and install the **Spring Boot Extension Pack**:
  - Type "Spring Boot Extension Pack" in the search bar and click "Install".
  - This pack includes tools to work effectively with Spring Boot.

### 1.3. Install the Java Development Kit (JDK)

- **Why:** The JDK is necessary to compile and run Java applications, including Spring Boot.
- **Installation:**
  - Download the JDK from the [Oracle website](https://www.oracle.com/java/technologies/javase-jdk11-downloads.html) or [AdoptOpenJDK](https://adoptopenjdk.net/).
  - Install it and configure the `JAVA_HOME` environment variable to point to the JDK installation folder.
  - Verify the installation by typing:
    ```bash
    java -version
    ```

## 2. Installation of Maven or Gradle

### 2.1. Why:

Maven and Gradle are project management and dependency management tools for Java projects.

### 2.2. Installation of Maven

- Download Maven from the [official Maven website](https://maven.apache.org/download.cgi).
- Unzip the downloaded archive.
- Add the `bin` folder of Maven to your `PATH` environment variable.
- Verify the installation with:
  ```bash
  mvn -version
  ```

### 2.3. Installation of Gradle (Optional)

- Download Gradle from the [official Gradle website](https://gradle.org/install/).
- Follow the same steps as Maven for installation and verification.

## 3. Installation of Git

### 3.1. Download and Install Git

- Go to the official [Git website](https://git-scm.com/).
- Download the version corresponding to your operating system.
- Follow the installation instructions. Make sure to check the option to add Git to your `PATH` environment variable during installation.

### 3.2. Verify Git Installation

- Open a terminal (or Git Bash on Windows).
- Type the following command to verify that Git is installed:
  ```bash
  git --version
  ```
  You should see the installed version of Git.

## 4. Installation of Node.js

### 4.1. Download and Install Node.js

- Go to the official [Node.js website](https://nodejs.org/).
- Download the LTS (Long Term Support) version for more stability.
- Follow the instructions to install Node.js on your computer.

### 4.2. Verify Node.js and NPM Installation

- Open a terminal.
- Type the following command to verify that Node.js is installed:
  ```bash
  node -v
  ```
  This should display the version of Node.js.
- Type the following command to verify that NPM (Node Package Manager) is installed:
  ```bash
  npm -v
  ```
  This should display the version of NPM.

### 4.3. Configure Environment Variables

- **On Windows:** Open "Advanced System Settings," then "Environment Variables." In the "System Variables" section, find the `Path` variable and add the path to the Node.js installation directory (typically `C:\Program Files\nodejs`).

## 5. Installation of Angular CLI

### 5.1. Install Angular CLI

- Open a terminal.
- Type the following command to install Angular CLI globally:
  ```bash
  npm install -g @angular/cli
  ```

### 5.2. Verify Angular CLI Installation

- Verify the version of Angular CLI by typing:
  ```bash
  ng version
  ```
  This should display the installed version of Angular CLI.

## 6. Installation of WampServer

### 6.1. Download and Install WampServer

- Go to the official [WampServer website](https://www.wampserver.com/).
- Download the version corresponding to your operating system (32 or 64 bits).
- Follow the installation instructions. During installation, you will need to choose a default browser (such as Chrome or Firefox) and a text editor (such as VS Code).

### 6.2. Verify WampServer Installation

- Launch WampServer after installation.
- Verify that the WampServer icon in the taskbar is green. If it is green, this means that the Apache and MySQL services are running correctly.
- Access `http://localhost` in your browser to verify that the web server is working.

## 7. Cloning and Running the Project

### 7.1. Clone the Project from GitHub

- Open a terminal.
- Navigate to the directory where you want to clone the project:
  ```bash
  cd ~/path/to/directory
  ```
- Clone the GitHub repository using the following command:
  ```bash
  git clone https://github.com/Roua-Ben-Emna/car-wash-station.git
  ```
- Navigate to the cloned project directory:
  ```bash
  cd car-wash-station
  ```

### 7.2. Configuration of the Spring Boot Backend

#### 7.2.1. Install Dependencies

- Navigate to the backend directory. If the backend is in a sub-folder (e.g., `back`), navigate to that directory:
  ```bash
  cd backend
  ```
- Install dependencies and compile the project with Maven:
  ```bash
  mvn clean install
  ```

#### 7.2.2. Database Configuration

- Ensure that WampServer is running and that MySQL is active.
- Create the MySQL database by importing the provided `washcarstation.sql ` file in the project. You can do this using phpMyAdmin.

#### Using phpMyAdmin:

- Open phpMyAdmin via `http://localhost/phpmyadmin`.
- Log in with your MySQL user.
- Click on "Import."
- Select the provided `washcarstation.sql ` file and click "Go."

#### 7.2.3. Configure Database Connection

- Edit the `application.properties` file in the `src/main/resources` directory of the backend to configure the database connection:
  ```properties
  spring.datasource.url=jdbc:mysql://localhost:3306/washcarstation
  spring.datasource.username=root
  spring.datasource.password=your_password
  ```
  Replace `your_password` with the correct password for the MySQL user.

#### 7.2.4. Start the Spring Boot Application

- Start the Spring Boot application with Maven:
  ```bash
  mvn spring-boot:run
  ```
- Access the API via `http://localhost:8090` to verify that the backend is functioning correctly.

### 7.3. Configuration of the Angular Frontend

#### 7.3.1. Install Dependencies for the Manager Frontend (Directory `frontManager/managercarwash`)

- Navigate to the `frontManager/managercarwash` directory:
  ```bash
  cd ../frontManager/managercarwash
  ```
- Install Angular dependencies:
  ```bash
  npm install
  ```

#### 7.3.2. Start the Angular Development Server (Manager)

- Start the Angular application for the manager:
  ```bash
  ng serve
  ```
- Access the application via `http://localhost:4200` to verify that the manager frontend is functioning correctly.

#### 7.3.3. Install Dependencies for the User Frontend (Directory `frontUser/carWashUser`)

- Navigate to the `frontUser/carWashUser` directory:
  ```bash
  cd ../../frontUser/carWashUser
  ```
- Install Angular dependencies:
  ```bash
  npm install
  ```

#### 7.3.4. Start the Angular Development Server (User)

- Start the Angular application for the user:
  ```bash
  ng serve
  ```
  (Use a different port)
- Access the application via `http://localhost:4201` to verify that the user frontend is functioning correctly.
