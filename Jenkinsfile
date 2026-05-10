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
                        dir("${FRONTEND_DIR}") {
                            sh "npm run build"
                            echo "Frontend build complete."
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
                sh "docker compose -f docker-compose.yml build --no-cache"
                echo "Docker images built."
            }
        }

        stage("Run Application") {
            steps {
                echo "Starting all services..."
                sh "docker compose -f docker-compose.yml down --remove-orphans || true"
                sh "docker compose -f docker-compose.yml up -d"
                sh "sleep 20"
                sh "docker compose -f docker-compose.yml ps"
                echo "Application is running at http://localhost"
            }
        }

      stage("Health Check") {
    steps {
        sh "sleep 10"
        sh "curl -f http://localhost:5000/api/health || (echo 'Backend health check failed' && exit 1)"
        sh "curl -f http://localhost:5001/health || (echo 'ML service health check failed' && exit 1)"
        sh "curl -f http://localhost:80 || (echo 'Frontend health check failed' && exit 1)"
        echo "All health checks passed."
    }
}
    }
    post {
        success {
            echo "=========================================="
            echo " BUILD SUCCEEDED"
            echo " App running at http://localhost"
            echo "=========================================="
        }
        failure {
            echo "=========================================="
            echo " BUILD FAILED"
            echo "=========================================="
        }
        always {
            echo "Pipeline finished."
        }
    }
}