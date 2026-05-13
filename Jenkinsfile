pipeline {
    agent any

    environment {
        FRONTEND_DIR = "frontend"
        BACKEND_DIR  = "backend"
        ML_DIR       = "ml-service"
        // Bridge to your Windows Docker engine
        DOCKER_HOST  = "tcp://host.docker.internal:2375" 
        FIREBASE_TOKEN = credentials('FIREBASE_TOKEN')
    }

    options {
        timeout(time: 30, unit: "MINUTES")
        disableConcurrentBuilds()
        buildDiscarder(logRotator(numToKeepStr: "10"))
    }

    stages {
        stage("Checkout") {
            steps {
                checkout scm
                sh "ls -la"
            }
        }

        stage("Install Dependencies") {
            parallel {
                stage("Frontend — npm install") {
                    steps {
                        dir("${FRONTEND_DIR}") {
                            sh "npm ci"
                        }
                    }
                }
                stage("Backend — pip install") {
                    steps {
                        dir("${BACKEND_DIR}") {
                            sh """
                                python3 -m venv venv
                                . venv/bin/activate
                                pip install --upgrade pip
                                pip install -r requirements.txt
                            """
                        }
                    }
                }
                stage("ML Service — pip install") {
                    steps {
                        dir("${ML_DIR}") {
                            sh """
                                python3 -m venv venv
                                . venv/bin/activate
                                pip install --upgrade pip
                                pip install -r requirements.txt
                            """
                        }
                    }
                }
            }
        }

        stage("Build") {
            parallel {
                stage("Build Frontend") {
                    steps {
                        dir("${FRONTEND_DIR}") {
                            sh "npm run build"
                        }
                    }
                }
                stage("Train ML Model") {
                    steps {
                        dir("${ML_DIR}") {
                            sh """
                                . venv/bin/activate
                                python training/train.py
                            """
                        }
                    }
                }
            }
        }

        stage("Test") {
            parallel {
                stage("Backend Tests") {
                    steps {
                        dir("${BACKEND_DIR}") {
                            sh """
                                . venv/bin/activate
                                mkdir -p test-results
                                python -m pytest tests/ -v --junit-xml=test-results/backend-results.xml
                            """
                        }
                    }
                    post {
                        always {
                            junit allowEmptyResults: true, testResults: "${BACKEND_DIR}/test-results/backend-results.xml"
                        }
                    }
                }
                stage("ML Tests") {
                    steps {
                        dir("${ML_DIR}") {
                            sh """
                                . venv/bin/activate
                                mkdir -p test-results
                                python -m pytest tests/ -v --junit-xml=test-results/ml-results.xml
                            """
                        }
                    }
                    post {
                        always {
                            junit allowEmptyResults: true, testResults: "${ML_DIR}/test-results/ml-results.xml"
                        }
                    }
                }
                stage("Frontend Lint") {
                    steps {
                        dir("${FRONTEND_DIR}") {
                            sh "npm run lint || true"
                        }
                    }
                }
            }
        }

        stage("Docker Build") {
            steps {
                sh "docker compose -f docker-compose.yml build --no-cache"
            }
        }

        stage("Run Application") {
            steps {
                sh "docker compose -f docker-compose.yml down --remove-orphans || true"
                sh "docker compose -f docker-compose.yml up -d"
                sh "sleep 30"
            }
        }

        stage("Deploy to Firebase Hosting") {
            steps {
                dir("${FRONTEND_DIR}") {
                    sh """
                        npx firebase-tools deploy --only hosting \
                            --token '${FIREBASE_TOKEN}' \
                            --project health-symptom-checker-3fcb9 \
                            --non-interactive
                    """
                }
            }
        }

        stage("Deploy Firestore Rules") {
            steps {
                dir("${FRONTEND_DIR}") {
                    sh """
                        npx firebase-tools deploy --only firestore \
                            --token '${FIREBASE_TOKEN}' \
                            --project health-symptom-checker-3fcb9 \
                            --non-interactive
                    """
                }
            }
        }
    }

    post {
        success {
            echo "BUILD SUCCEEDED - App live at https://health-symptom-checker-3fcb9.web.app"
        }
        failure {
            echo "BUILD FAILED - Check the logs above."
        }
        always {
            echo "Pipeline finished."
        }
    }
}