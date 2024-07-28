pipeline {
    agent any

    environment {
        DOCKER_CREDENTIALS_ID = 'docker-hub'
        DOCKERHUB_NAMESPACE = 'mabd117'
        BACKEND_IMAGE = "${DOCKERHUB_NAMESPACE}/hotel-backend"
        FRONTEND_IMAGE = "${DOCKERHUB_NAMESPACE}/hotel-frontend"
        KUBECONFIG_CREDENTIALS_ID = 'k8s'
        GITHUB_CREDENTIALS_ID = 'github-token'
        GIT_REPO = 'https://github.com/mabd117/hotel-management-system.git'
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/mabd117/hotel-management-system.git'
            }
        }
        stage('Build Backend Image') {
            steps {
                dir('backend') {
                    script {
                        docker.build("${BACKEND_IMAGE}:latest")
                    }
                }
            }
        }
        stage('Build Frontend Image') {
            steps {
                dir('frontend') {
                    script {
                        docker.build("${FRONTEND_IMAGE}:latest")
                    }
                }
            }
        }
        stage('Push Backend Image') {
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', DOCKER_CREDENTIALS_ID) {
                        docker.image("${BACKEND_IMAGE}:latest").push()
                    }
                }
            }
        }
        stage('Push Frontend Image') {
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', DOCKER_CREDENTIALS_ID) {
                        docker.image("${FRONTEND_IMAGE}:latest").push()
                    }
                }
            }
        }
        stage('Deploy to Kubernetes') {
            steps {
                withKubeConfig([credentialsId: KUBECONFIG_CREDENTIALS_ID, namespace: 'default']) {
                    // Use shell to ensure paths are correct
                    sh '''
                    kubectl apply -f k8s/mongo-deployment.yaml
                    kubectl apply -f k8s/mongo-service.yaml
                    kubectl apply -f k8s/backend-deployment.yaml
                    kubectl apply -f k8s/frontend-deployment.yaml
                    kubectl set image deployment/backend-deployment backend=${BACKEND_IMAGE}:latest
                    kubectl set image deployment/frontend-deployment frontend=${FRONTEND_IMAGE}:latest
                    '''
                }
            }
        }
        stage('Push to GitHub') {
            steps {
                withCredentials([string(credentialsId: GITHUB_CREDENTIALS_ID, variable: 'GITHUB_TOKEN')]) {
                    sh '''
                   
                    git config user.name "mabd117"
                    git remote set-url origin https://your-github-token@github.com/mabd117/hotel-management-system.git
                    git add .
                    git commit -m "Automated commit"
                    git push origin main
                    '''
                }
            }
        }
    }
}

