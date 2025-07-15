pipeline {
  agent any

  environment {
    DOCKER_CREDENTIALS = credentials('docker-hub-login')
  }

  stages {
    stage('Build & Push Docker Image') {
      steps {
        script {
          env.port = 3002
          env.tag = "Dev-"

          if (env.BRANCH_NAME == "master") {
            env.tag = ""
            env.port = 3003
          }

          sh """
            docker build -t umershamshad/bun-app:${tag}latest -t umershamshad/bun-app:${tag}${BUILD_NUMBER} .
            echo ${DOCKER_CREDENTIALS_PSW} | docker login -u ${DOCKER_CREDENTIALS_USR} --password-stdin
            docker push umershamshad/bun-app:${tag}latest
            docker push umershamshad/bun-app:${tag}${BUILD_NUMBER}
            sed -i 's|umershamshad/bun-app:.*|umershamshad/bun-app:${tag}${BUILD_NUMBER}|' k8s/deployment.yaml
            git add k8s/deployment.yaml
            git commit -m "Update image tag to ${tag}${BUILD_NUMBER}"
            git push origin HEAD:${BRANCH_NAME}
          """
        }
      }
    }
  }

     post {
    success {
      echo "✅ Deployment successful!"
    }
    failure {
      echo "❌ Deployment failed!"
    }
  }
}
