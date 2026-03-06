pipeline {
    agent any
    stages {
        stage('拉取代码') {
            steps {
                echo '✅ 代码拉取成功'
            }
        }
        stage('编译') {
            steps {
                echo '✅ 编译成功'
            }
        }
        stage('打包') {
            steps {
                echo '✅ 打包成功'
            }
        }
    }
    post {
        success {
            echo '🎉 构建全部成功！'
        }
    }
}


