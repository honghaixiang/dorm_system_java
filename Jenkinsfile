pipeline {
    agent any
    tools {
        maven 'Maven'  // 你 Jenkins 里配置的 Maven 名称
    }
    triggers {
        pollSCM('* * * * *')  // 每分钟检查代码更新
    }
    stages {
        stage('拉取代码') {
            steps {
                git url: 'D:/11/dorm_system_java', branch: 'master'
            }
        }
        stage('编译') {
            steps {
                bat 'mvn clean compile -DskipTests'
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
            echo '✅ 构建、测试、打包 全部成功！'
        }
    }
}