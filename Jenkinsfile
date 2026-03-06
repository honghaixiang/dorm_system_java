pipeline {
    agent any
    stages {
        stage('验证') {
            steps {
                echo '✅ Jenkins 流水线正常运行！'
            }
        }
    }
    post {
        success {
            echo '🎉 构建完全成功！'
        }
    }
}
}
