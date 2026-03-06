pipeline {
    agent any
    tools {
        maven 'Maven'
    }
    stages {
        stage('编译') {
            steps {
                bat 'mvn clean compile -DskipTests'
            }
        }
        stage('打包') {
            steps {
                bat 'mvn package -DskipTests'
            }
        }
    }
    post {
        success {
            echo '✅ 构建成功！'
        }
    }
}
