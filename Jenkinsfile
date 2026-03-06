pipeline {
    agent any
    stages {
        stage('代码拉取成功') {
            steps {
                echo '✅ Git 拉取代码成功'
            }
        }
        stage('编译模拟') {
            steps {
                echo '✅ 编译完成（模拟）'
            }
        }
        stage('打包模拟') {
            steps {
                echo '✅ 打包完成（模拟）'
            }
        }
    }
    post {
        success {
            echo '=================================='
            echo '🎉 恭喜！Jenkins 流水线完全成功！'
            echo '=================================='
        }
    }
}