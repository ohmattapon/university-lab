pipeline {
  agent { label 'wsl' }

  environment {
    APP_DIR = '/mnt/d/university-lab'
    // k3d lives in ~/.local/bin; make sure sh steps find docker/kubectl/k3d
    PATH = "/home/attpon1579/.local/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin"
  }

  stages {
    stage('Build backend image') {
      steps {
        sh 'docker build -t lab-backend:latest "$APP_DIR/backend"'
      }
    }

    stage('Build frontend image') {
      steps {
        sh 'docker build -t lab-frontend:latest "$APP_DIR/frontend"'
      }
    }

    stage('Import images to k3d') {
      steps {
        sh '/home/attpon1579/.local/bin/k3d image import lab-backend:latest lab-frontend:latest -c university-lab'
      }
    }

    stage('Deploy to Kubernetes') {
      steps {
        sh 'kubectl apply -f "$APP_DIR/k8s/namespace.yaml" && kubectl apply -f "$APP_DIR/k8s/backend.yaml" -f "$APP_DIR/k8s/frontend.yaml" -f "$APP_DIR/k8s/ingress.yaml" -f "$APP_DIR/k8s/hpa.yaml"'
      }
    }

    stage('Rollout status') {
      steps {
        sh 'kubectl -n university-lab rollout status deploy/backend --timeout=180s && kubectl -n university-lab rollout status deploy/frontend --timeout=180s'
      }
    }

    stage('Smoke test via Ingress') {
      steps {
        sh '''
          kubectl -n kube-system port-forward svc/traefik 38080:80 >pf.log 2>&1 & echo $! >pf.pid
          sleep 6
          curl -sf http://127.0.0.1:38080/api/hello
          echo
          curl -sf http://127.0.0.1:38080/health
          echo
          kill "$(cat pf.pid)"
        '''
      }
    }
  }

  post {
    always {
      sh 'kubectl -n university-lab get pods'
    }
  }
}
