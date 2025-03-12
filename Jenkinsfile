pipeline {
    agent {
        docker {
            image 'mogoose/playwright-nj-v1.51.0-noble'
            args '--network qa_teste_playwright_coco_bambu_bambunet'
        }
    }
    
    environment {
        JAVA_HOME = "/usr/lib/jvm/java-21-openjdk-arm64"
        PATH = "$JAVA_HOME/bin:$PATH"
    }

    stages {
        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Run Tests') {
            steps {
                sh 'npx playwright test'  // Run Playwright tests
                allure includeProperties: false, jdk: '', results: [[path: 'allure-results']] // Generate Allure report
            }
        }
    
    }
}