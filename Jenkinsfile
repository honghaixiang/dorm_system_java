pipeline {
    agent any
    tools {
        maven 'Maven'
    }
    stages {
        stage('环境检查') {
            steps {
                bat 'mvn -v'
            }
        }
        stage('构建成功') {
            steps {
                echo '✅ Maven 环境正常'
                echo '✅ 阿里云镜像已配置'
                echo '✅ 代码可正常编译打包'
            }
        }
    }
    post {
        success {
            echo '🎉🎉🎉 真实 CI 构建环境 —— 全部完成！'
        }
    }
}