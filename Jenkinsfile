pipeline {
    agent any
    tools {
        maven 'Maven'
    }
    stages {
        stage('清理') {
            steps {
                bat 'mvn clean -DskipTests'
            }
        }
        stage('编译') {
            steps {
                bat 'mvn compile -DskipTests'
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
            echo '===================================='
            echo '✅ 构建成功！'
            echo '📦 jar 包已生成在 target 文件夹'
            echo '===================================='
        }
    }
}