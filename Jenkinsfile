pipeline {
    agent any

    // ── Environment variables ────────────────────────────────────
    environment {
        FRONTEND_DIR  = "frontend"
        BACKEND_DIR   = "backend"
        ML_DIR        = "ml-service"
        COMPOSE_FILE  = "docker-compose.yml"
        NODE_VERSION  = "20"
    }

    // ── Pipeline options ─────────────────────────────────────────
    options {
        timeout(time: 30, unit: "MINUTES")
        disableConcurrentBuilds()
        buildDiscarder(logRotator(numToKeepStr: "10"))
    }

    stages {

        // ── Stage 1: Checkout ────────────────────────────────────
        stage("Checkout") {
            steps {
                echo "=========================================="
                echo " Checking out source code"
                echo "=========================================="
                checkout scm
                echo "Source code checked out successfully."
                sh "ls -la"
            }
        }

        // ── Stage 2: Install Dependencies ───────────────────────
        stage("Install Dependencies") {
            parallel {

                stage("Frontend — npm install") {
                    steps {
                        echo "Installing React dependencies..."
                        dir("${FRONTEND_DIR}") {
                            sh "npm ci"
                            echo "Frontend dependencies installed."
                        }
                    }
                }

                stage("Backend — pip install") {
                    steps {
                        echo "Installing Flask dependencies..."
                        dir("${BACKEND_DIR}") {
                            sh """
                                python3 -m venv venv
                                . venv/bin/activate
                                pip install --upgrade pip
                                pip install -r requirements.txt
                            """
                            echo "Backend dependencies installed."
                        }
                    }
                }

                stage("ML Service — pip install") {
                    steps {
                        echo "Installing ML dependencies..."
                        dir("${ML_DIR}") {
                            sh """
                                python3 -m venv venv
                                . venv/bin/activate
                                pip install --upgrade pip
                                pip install -r requirements.txt
                            """
                            echo "ML dependencies installed."
                        }
                    }
                }
            }
        }

        // ── Stage 3: Build ───────────────────────────────────────
        stage("Build") {
            parallel {

                stage("Build Frontend") {
                    steps {
                        echo "=========================================="
                        echo " Building React frontend"
                        echo "=========================================="
                        dir("${FRONTEND_DIR}") {
                            sh "npm run build"
                            echo "Frontend build complete. Output in dist/"
                            sh "ls -la dist/"
                        }
                    }
                }

                stage("Train ML Model") {
                    steps {
                        echo "=========================================="
                        echo " Training ML model"
                        echo "=========================================="
                        dir("${ML_DIR}") {
                            sh """
                                . venv/bin/activate
                                python training/train.py
                            """
                            echo "ML model trained and saved."
                        }
                    }
                }
            }
        }

        // ── Stage 4: Test ────────────────────────────────────────
        stage("Test") {
            parallel {

                stage("Backend Unit Tests") {
                    steps {
                        echo "=========================================="
                        echo " Running Flask backend tests"
                        echo "=========================================="
                        dir("${BACKEND_DIR}") {
                            sh """
                                . venv/bin/activate
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

                stage("ML Service Tests") {
                    steps {
                        echo "=========================================="
                        echo " Running ML service tests"
                        echo "=========================================="
                        dir("${ML_DIR}") {
                            sh """
                                . venv/bin/activate
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
                        echo "=========================================="
                        echo " Linting React frontend"
                        echo "=========================================="
                        dir("${FRONTEND_DIR}") {
                            sh "npm run lint || true"
                            echo "Frontend lint complete."
                        }
                    }
                }
            }
        }

        // ── Stage 5: Docker Build ────────────────────────────────
        stage("Docker Build") {
            steps {
                echo "=========================================="
                echo " Building Docker images"
                echo "=========================================="
                sh "docker-compose -f ${COMPOSE_FILE} build --no-cache"
                echo "All Docker images built successfully."
                sh "docker images | grep symptom"
            }
        }

        // ── Stage 6: Docker Run ──────────────────────────────────
        stage("Run Application") {
            steps {
                echo "=========================================="
                echo " Starting all services"
                echo "=========================================="

                // Stop any existing containers first
                sh "docker-compose -f ${COMPOSE_FILE} down --remove-orphans || true"

                // Start all services in background
                sh "docker-compose -f ${COMPOSE_FILE} up -d"

                echo "Waiting for services to be healthy..."
                sh "sleep 20"

                // Check all containers are running
                sh "docker-compose -f ${COMPOSE_FILE} ps"

                echo "=========================================="
                echo " Application is running at http://localhost"
                echo "=========================================="
            }
        }

        // ── Stage 7: Health Check ────────────────────────────────
        stage("Health Check") {
            steps {
                echo "=========================================="
                echo " Verifying all services are healthy"
                echo "=========================================="

                // Check Flask backend
                sh """
                    echo "Checking Flask backend..."
                    curl -f http://localhost:5000/api/health || \
                    (echo "Backend health check failed" && exit 1)
                    echo "Flask backend: OK"
                """

                // Check ML service
                sh """
                    echo "Checking ML service..."
                    curl -f http://localhost:5001/health || \
                    (echo "ML service health check failed" && exit 1)
                    echo "ML service: OK"
                """

                // Check frontend
                sh """
                    echo "Checking frontend..."
                    curl -f http://localhost || \
                    (echo "Frontend health check failed" && exit 1)
                    echo "Frontend: OK"
                """

                echo "All health checks passed."
            }
        }
    }

    // ── Post actions ─────────────────────────────────────────────
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
            echo " Stopping containers..."
            echo "=========================================="
            sh "docker-compose -f ${COMPOSE_FILE} down || true"
        }

        always {
            echo "Pipeline finished. Cleaning workspace..."
            cleanWs(
                cleanWhenSuccess: false,
                cleanWhenFailure: false,
                cleanWhenAborted: true
            )
        }
    }
}