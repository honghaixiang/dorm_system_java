pipeline {
    agent any
    tools {
        maven 'Maven'
    }
    stages {
        stage('编译+打包') {
            steps {
                bat 'mvn package -Dmaven.test.skip=true -DskipTests'
            }
        }
    }
    post {
        success {
            echo '✅ 真实构建 SUCCESS —— 已生成 jar 包！'
        }
        failure {
            echo '❌ 构建失败'
        }
    }
}