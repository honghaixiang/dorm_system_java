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
        stage('测试') {
            steps {
                bat 'mvn test -DskipTests=false'
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
            echo ''
            echo '============================================='
            echo '✅ 构建全流程成功！'
            echo '✅ 清理 → 编译 → 测试 → 打包 全部完成'
            echo '📦 jar 包已生成在 target 文件夹'
            echo '============================================='
            echo ''
        }
        failure {
            echo '❌ 构建失败，请检查代码或依赖'
        }
    }
}