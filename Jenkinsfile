pipeline {
    agent any
    tools {
        maven 'Maven'
    }
    stages {
        stage('清理') {
            steps {
                bat 'mvn clean'
            }
        }
        stage('编译') {
            steps {
                bat 'mvn compile'
            }
        }
        stage('测试') {
            steps {
                bat 'mvn test'
            }
        }
        stage('打包') {
            steps {
                bat 'mvn package'
            }
        }
    }
    post {
        success {
            echo "========================================"
            echo "✅ 构建成功！"
            echo "📦 jar 包已生成在 target 目录"
            echo "========================================"
        }
        failure {
            echo "❌ 构建失败！"
        }
    }
}