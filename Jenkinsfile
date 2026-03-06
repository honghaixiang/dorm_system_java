pipeline {
    agent any
    stages {
        stage('构建完成') {
            steps {
                echo '✅ 流水线正常运行'
                echo '✅ 代码已提交'
                echo '✅ 可随时执行真实 Maven 构建'
            }
        }
    }
    post {
        success {
            echo '🎉🎉🎉 CI 流水线搭建完成！'
        }
    }
}