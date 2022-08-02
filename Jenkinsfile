def COLOR_MAP = ['SUCCESS': '05b222', 'FAILURE': 'd00000', 'UNSTABLE': 'ffff00', 'ABORTED': '933a16']
def WEBHOOK_URL = "https://outlook.office.com/webhook/ea4d9c79-d63d-43ac-bc6b-4a3acbda8d74@53ace978-e1e5-4f0d-8169-a1535d3d6877/JenkinsCI/a2987aaf855b42b68c90c4f970a277fc/0a54fcff-0322-448f-b310-a0aa997122e8"

pipeline {
    agent any

    environment {
        CI = 'true'
        scannerHome = tool 'esl-sonarqube';
    }
    stages {
        stage('Node Install') {
            steps {
                sh 'ls -la'
                sh 'rm -rf ~/tmp'
                sh 'npm cache clear'
                sh 'make install'
            }
        }

        // stage('Build') {
        //     steps {
        //         sh 'make build'
        //     }
        // }
       
        // stage('Test') {
        //     steps {
        //         sh 'make test'
        //     }
        // }

        stage('Code-Analysis'){
            steps {
                withSonarQubeEnv('esl-sonarqube') {
                      sh 'echo "SonarQube Phase"'
                      sh "make analyze"
                }
            }
        }

        stage('Quality Gate'){
            steps{
                timeout(time: 1, unit: 'HOURS') {
                   script{
                       def qg = waitForQualityGate()
                       if (qg.status != 'OK') {
                         error "Pipeline aborted due to quality gate failure: ${qg.status}"
                       }
                   }
                }
            }
        }

        stage('Push Image'){
            steps{
                sh 'echo "Pushing Image to Docker Hub" '
                sh 'make docker-image'
            }
        }

        stage('Deploy'){
            steps {
                sh 'echo "Depoying" '
                sshPublisher(publishers: [sshPublisherDesc(configName: 'Deploy', transfers: [sshTransfer(cleanRemote: false, excludes: '', execCommand: 'bash deploy.sh && rm deploy.sh', execTimeout: 120000, flatten: false, makeEmptyDirs: false, noDefaultExcludes: false, patternSeparator: '[, ]+', remoteDirectory: '', remoteDirectorySDF: false, removePrefix: '', sourceFiles: 'deploy.sh')], usePromotionTimestamp: false, useWorkspaceInPromotion: false, verbose: false)])
            }
        }
    }

    post {
        always {
            office365ConnectorSend message: "started ${env.JOB_NAME} ${env.BUILD_NUMBER} (More info at <${env.BUILD_URL}|Open>) \n remarks: ${COLOR_MAP[currentBuild.currentResult]}", color: COLOR_MAP[currentBuild.currentResult], status: " ${currentBuild.currentResult}", webhookUrl: "${WEBHOOK_URL}"
        }
    }
}

