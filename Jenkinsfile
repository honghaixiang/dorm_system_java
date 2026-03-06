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
            echo '================================================'
            echo '✅ 项目构建 编译 打包 全部成功！'
            echo '📦 生成的 jar 包在 target 目录下'
            echo '================================================'
        }
    }
}