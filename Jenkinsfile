pipeline {
    agent any
    tools {
        maven 'Maven'
    }
    stages {
        stage('拉取代码') {
            steps {
                echo '✅ 代码拉取完成'
            }
        }

        stage('编译') {
            steps {
                bat 'mvn compile -DskipTests'
            }
        }

        stage('测试') {
            steps {
                bat 'mvn test'
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
            echo '🎉 项目构建 SUCCESS'
            echo '✅ 编译完成'
            echo '✅ 测试完成'
            echo '✅ 打包完成（jar 在 target 目录）'
            echo '================================================'
        }
        failure {
            echo '❌ 构建失败，请检查代码或依赖'
        }
    }
}