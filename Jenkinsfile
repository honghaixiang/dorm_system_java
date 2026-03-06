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
        stage('编译打包') {
            steps {
                bat 'mvn package -DskipTests -Dmaven.test.skip=true'
            }
        }
    }
    post {
        success {
            echo "========================================"
            echo "✅ 真实构建完成！"
            echo "📦 jar 已生成在 target 文件夹"
            echo "========================================"
        }
        failure {
            echo "❌ 构建失败"
        }
    }
}