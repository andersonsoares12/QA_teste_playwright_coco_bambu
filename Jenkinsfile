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
                sh 'npx playwright test'
            }
        }

        stage('Generate Allure Report') {
            steps {
                sh '''
                    echo "Setting up Allure report..."
                    /var/jenkins_home/tools/ru.yandex.qatools.allure.jenkins.tools.AllureCommandlineInstallation/allure/bin/allure generate allure-results -c -o allure-report
                '''
                allure includeProperties: false, jdk: 'default', results: [[path: 'allure-results']]
            }
        }
    }
}