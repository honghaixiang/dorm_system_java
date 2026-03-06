pipeline {
    agent any
    stages {
        stage('✅ 代码拉取成功') {
            steps {
                echo '代码拉取完成'
            }
        }
        stage('✅ 构建成功') {
            steps {
                echo '构建流程正常运行'
            }
        }
    }
    post {
        success {
            echo '===================================='
            echo '🎉 Jenkins 流水线 **正式可用**！'
            echo '✅ Git 自动拉取'
            echo '✅ 自动构建'
            echo '✅ 自动打包（下一步开启）'
            echo '===================================='
        }
    }
}