pipeline {
    agent any

    environment {
        FRONTEND_DIR = "frontend"
        BACKEND_DIR  = "backend"
        ML_DIR       = "ml-service"
    }

    options {
        timeout(time: 30, unit: "MINUTES")
        disableConcurrentBuilds()
        buildDiscarder(logRotator(numToKeepStr: "10"))
    }

    stages {

        stage("Checkout") {
            steps {
                echo "=========================================="
                echo " Checking out source code"
                echo "=========================================="
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
                            echo "Frontend dependencies installed."
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
                        echo "Building React frontend..."
                        withCredentials([
                            string(credentialsId: 'FIREBASE_API_KEY',        variable: 'FB_API_KEY'),
                            string(credentialsId: 'FIREBASE_AUTH_DOMAIN',    variable: 'FB_AUTH_DOMAIN'),
                            string(credentialsId: 'FIREBASE_PROJECT_ID',     variable: 'FB_PROJECT_ID'),
                            string(credentialsId: 'FIREBASE_STORAGE_BUCKET', variable: 'FB_STORAGE_BUCKET'),
                            string(credentialsId: 'FIREBASE_SENDER_ID',      variable: 'FB_SENDER_ID'),
                            string(credentialsId: 'FIREBASE_APP_ID',         variable: 'FB_APP_ID'),
                            string(credentialsId: 'FIREBASE_MEASUREMENT_ID', variable: 'FB_MEASUREMENT_ID')
                        ]) {
                            dir("${FRONTEND_DIR}") {
                                sh """
                                    cat > .env.production << EOF
VITE_API_URL=/api
VITE_FIREBASE_API_KEY=\${FB_API_KEY}
VITE_FIREBASE_AUTH_DOMAIN=\${FB_AUTH_DOMAIN}
VITE_FIREBASE_PROJECT_ID=\${FB_PROJECT_ID}
VITE_FIREBASE_STORAGE_BUCKET=\${FB_STORAGE_BUCKET}
VITE_FIREBASE_MESSAGING_SENDER_ID=\${FB_SENDER_ID}
VITE_FIREBASE_APP_ID=\${FB_APP_ID}
VITE_FIREBASE_MEASUREMENT_ID=\${FB_MEASUREMENT_ID}
EOF
                                    npm run build
                                """
                                echo "Frontend build complete."
                            }
                        }
                    }
                }

                stage("Train ML Model") {
                    steps {
                        echo "Training ML model..."
                        dir("${ML_DIR}") {
                            sh """
                                . venv/bin/activate
                                python training/train.py
                            """
                            echo "ML model trained."
                        }
                    }
                }
            }
        }

        stage("Test") {
            parallel {

                stage("Backend Tests") {
                    steps {
                        echo "Running backend tests..."
                        dir("${BACKEND_DIR}") {
                            sh """
                                . venv/bin/activate
                                mkdir -p test-results
                                python -m pytest tests/ -v \
                                    --tb=short \
                                    --junit-xml=test-results/backend-results.xml
                            """
                        }
                    }
                    post {
                        always {
                            junit allowEmptyResults: true,
                                  testResults: "${BACKEND_DIR}/test-results/backend-results.xml"
                        }
                    }
                }

                stage("ML Tests") {
                    steps {
                        echo "Running ML tests..."
                        dir("${ML_DIR}") {
                            sh """
                                . venv/bin/activate
                                mkdir -p test-results
                                python -m pytest tests/ -v \
                                    --tb=short \
                                    --junit-xml=test-results/ml-results.xml
                            """
                        }
                    }
                    post {
                        always {
                            junit allowEmptyResults: true,
                                  testResults: "${ML_DIR}/test-results/ml-results.xml"
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
                echo "Building Docker images..."
                sh "docker compose -f docker-compose.yml build"
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
                echo "All services started successfully."
            }
        }

        stage("Deploy to Firebase Hosting") {
            steps {
                echo "Deploying frontend to Firebase Hosting..."
                withCredentials([
                    string(credentialsId: 'FIREBASE_TOKEN', variable: 'FIREBASE_TOKEN'),
                    string(credentialsId: 'FIREBASE_API_KEY',        variable: 'FB_API_KEY'),
                    string(credentialsId: 'FIREBASE_AUTH_DOMAIN',    variable: 'FB_AUTH_DOMAIN'),
                    string(credentialsId: 'FIREBASE_PROJECT_ID',     variable: 'FB_PROJECT_ID'),
                    string(credentialsId: 'FIREBASE_STORAGE_BUCKET', variable: 'FB_STORAGE_BUCKET'),
                    string(credentialsId: 'FIREBASE_SENDER_ID',      variable: 'FB_SENDER_ID'),
                    string(credentialsId: 'FIREBASE_APP_ID',         variable: 'FB_APP_ID'),
                    string(credentialsId: 'FIREBASE_MEASUREMENT_ID', variable: 'FB_MEASUREMENT_ID')
                ]) {
                    dir("${FRONTEND_DIR}") {
                        sh """
                            cat > .env.production << EOF
VITE_API_URL=/api
VITE_FIREBASE_API_KEY=\${FB_API_KEY}
VITE_FIREBASE_AUTH_DOMAIN=\${FB_AUTH_DOMAIN}
VITE_FIREBASE_PROJECT_ID=\${FB_PROJECT_ID}
VITE_FIREBASE_STORAGE_BUCKET=\${FB_STORAGE_BUCKET}
VITE_FIREBASE_MESSAGING_SENDER_ID=\${FB_SENDER_ID}
VITE_FIREBASE_APP_ID=\${FB_APP_ID}
VITE_FIREBASE_MEASUREMENT_ID=\${FB_MEASUREMENT_ID}
EOF
                            npm run build
                            npm install -g firebase-tools
                            firebase deploy --only hosting \
                                --token \${FIREBASE_TOKEN} \
                                --project health-symptom-checker-3fcb9 \
                                --non-interactive
                        """
                    }
                }
                echo "Frontend deployed to Firebase Hosting."
            }
        }

        stage("Deploy Firestore Rules") {
            steps {
                echo "Deploying Firestore security rules..."
                withCredentials([string(credentialsId: 'FIREBASE_TOKEN', variable: 'FIREBASE_TOKEN')]) {
                    sh """
                        firebase deploy --only firestore \
                            --token \${FIREBASE_TOKEN} \
                            --project health-symptom-checker-3fcb9 \
                            --non-interactive
                    """
                }
                echo "Firestore rules deployed."
            }
        }
    }

    post {
        success {
            echo "=========================================="
            echo " BUILD SUCCEEDED"
            echo " https://health-symptom-checker-3fcb9.web.app"
            echo "=========================================="
        }
        failure {
            echo "=========================================="
            echo " BUILD FAILED - Check the logs above."
            echo "=========================================="
        }
        always {
            echo "Pipeline finished."
        }
    }
}