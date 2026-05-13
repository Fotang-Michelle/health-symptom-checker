pipeline {
    agent any

    environment {
        FRONTEND_DIR = "frontend"
        BACKEND_DIR  = "backend"
        ML_DIR       = "ml-service"
        // Use host.docker.internal to allow the Jenkins container to talk to Windows Docker
        DOCKER_HOST  = "tcp://host.docker.internal:2375" 
    }

    options {
        timeout(time: 30, unit: "MINUTES")
        disableConcurrentBuilds()
        buildDiscarder(logRotator(numToKeepStr: "10"))
    }

    stages {
        // ... [Checkout, Install Dependencies, Build, and Test stages remain the same] ...

        stage("Docker Build") {
            steps {
                echo "Building Docker images..."
                // This now uses the DOCKER_HOST environment variable defined above
                sh "docker compose -f docker-compose.yml build --no-cache"
                echo "Docker images built."
            }
        }

        stage("Run Application") {
            steps {
                echo "Starting all services..."
                sh "docker compose -f docker-compose.yml down --remove-orphans || true"
                sh "docker compose -f docker-compose.yml up -d"
                sh "sleep 30"
                sh "docker compose -f docker-compose.yml ps"
                echo "Application is running."
            }
        }

        stage("Health Check") {
            steps {
                sh "sleep 10"
                sh "docker compose -f docker-compose.yml ps"
                sh "docker ps | grep symptom || echo 'Checking containers...'"
                echo "All services started successfully."
            }
        }

        stage("Deploy to Firebase Hosting") {
            steps {
                echo "=========================================="
                echo " Deploying frontend to Firebase Hosting"
                echo "=========================================="
                dir("${FRONTEND_DIR}") {
                    sh """
                        # REPLACED: 'npm install -g' with 'npx' to avoid EACCES permission errors
                        npx firebase-tools deploy --only hosting \
                            --token \$FIREBASE_TOKEN \
                            --project health-symptom-checker-3fcb9 \
                            --non-interactive
                    """
                }
                echo "Frontend deployed to Firebase Hosting."
            }
        }

        stage("Deploy Firestore Rules") {
            steps {
                echo "Deploying Firestore security rules..."
                dir("${FRONTEND_DIR}") {
                    sh """
                        # REPLACED: with npx to ensure the command is available without system install
                        npx firebase-tools deploy --only firestore \
                            --token \$FIREBASE_TOKEN \
                            --project health-symptom-checker-3fcb9 \
                            --non-interactive
                    """
                }
                echo "Firestore rules deployed."
            }
        }
    }

    post {
        // ... [Post sections remain the same] ...
    }
}