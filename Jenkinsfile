pipeline {
    agent any
    tools {
        maven 'Maven'
    }
    stages {
        stage('清理') {
            steps {
                powershell 'mvn clean'
            }
        }
        stage('编译') {
            steps {
                powershell 'mvn compile -DskipTests'
            }
        }
        stage('打包') {
            steps {
                powershell 'mvn package -DskipTests'
            }
        }
    }
    post {
        success {
            echo '✅ 真实构建成功！jar 已生成在 target 目录'
        }
    }
}