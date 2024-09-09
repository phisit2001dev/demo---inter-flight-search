pipeline {
    agent any
    
    parameters {
        string(name: 'APPVERSION', defaultValue: params.APPVERSION, description: 'Please fill version')
        booleanParam(name: 'BuildDevTemp', description: '')
        booleanParam(name: 'BuildDev', description: '')
		booleanParam(name: 'ForceBuildDev', description: '')
        booleanParam(name: 'ReleaseTag', description: '')
        string(name: 'REVDEVTEMP', defaultValue: params.REVDEVTEMP, description: 'Please fill revision of dev temp.')
    }
       
    triggers {
        GenericTrigger(
        genericVariables: [
        [key: 'BuildDevTemp', value: '$.BuildDevTemp'],
        [key: 'BuildDev', value: '$.BuildDev'],
		[key: 'ForceBuildDev', value: '$.ForceBuildDev'],
        [key: 'REVDEVTEMP', value: '$.REVDEVTEMP'],
        [key: 'ref', value: '$.ref'], //UI
        [key: 'TRIGGER_USERNAME', value: '$.TRIGGER_USERNAME'], // V 1.7.0
        ],

        causeString: 'Triggered on $TRIGGER_USERNAME',
        token: '7f5648a3-d803-4141-8ef1-893f28630b4d',
        regexpFilterText: '$ref',
        regexpFilterExpression: 'PNGIAPI_CSC_UI|ALL'

        )
    }
       
    environment {
        GITLAB_CRIDEN = credentials('GITLAB-jenkins')
        GITLAB_CRIDEN_ID = 'GITLAB-jenkins'
        BRANCH = 'master'
        URL_GIT_REPO = "${env.URL_GIT_REPO}/PNG_IAPI/SourceCode/WEB/CSC/csc.git" 
        
        TOMCAT_CRIDEN_ID = 'PNG-DEV-tomcat_script'
        TOMCAT1_URL = 'http://10.202.101.13:8080/'
		TOMCAT2_URL = 'http://10.202.101.14:8080/'

        TOMCAT_DEPLOY_CONTEXT_CSC_DEV_TEMP_PATH = '/csc-dev-temp'
		TOMCAT_DEPLOY_CONTEXT_CSC_DEV_PATH = '/csc-dev'

        GIT_COMMIT_DEV_TEMP_SUCCESS = ""
        GIT_COMMIT_DEV_SUCCESS = ""
        GIT_COMMIT_DEV_SUCCESS_RIVISION = ""
        
        TAG_NAME_PRE_ALPHA_RELEASE = "${params.APPVERSION}-PRE-ALPHA-RELEASE"
        TAG_NAME_ALPHA_RELEASE = "${params.APPVERSION}-ALPHA-RELEASE"

        NO_ABORTED = true
    }	
       
    tools {
        maven 'apache-maven-3.6.1'
        ant 'Ant182'
        nodejs "NodeJS16.15.0"
    } 

    stages {
        stage('initial') {
            steps {
                script {
                    currentBuild.displayName = params.APPVERSION + "-" + String.format("%04d", currentBuild.number)
                    
                    //For Ant Replae version
                    env.APP_VERSION = currentBuild.displayName					
                }		
            }			
        }

        stage('Build And Deploy PRE ALPHA') {
            when { 
                expression { 
                    params['BuildDevTemp']
                }
            }
            stages {
                stage('Check Out'){
					steps {
						echo 'Building Dev Temp'

						script {
							currentBuild.displayName = currentBuild.displayName + "  :   PRE ALPHA"
						}
						
						checkout([$class: 'GitSCM', branches: [[name: params.REVDEVTEMP]], extensions: [], userRemoteConfigs: [[credentialsId: GITLAB_CRIDEN_ID, url: URL_GIT_REPO]]])

						sh 'npm install'
						sh 'npm rebuild node-sass'
					}
				}

                stage('Build'){
					steps {
						parallel (
							csc : {
                                sh 'node --max_old_space_size=2048 node_modules/.bin/ng build --configuration=temp --output-path=dist/dev_temp/csc --base-href=/csc-dev-temp/ --aot=true'
							}
						)
					}
				}

                stage('Deploy'){
					steps {
						sh 'ant addBuildNumber_DevTemp'
						sh 'ant build_csc_dev_temp_war'

						/*Deploy Dev Temp*/
						//1. ต้องลง Plugin Deploy Container ถึงจะใช้ command deploy ได้  /  2. ต้องสร้าง Credential
						//1.11.0  งาน App , WS เพิ่ม Catch error และ Retry 1 รอบกรณี Deploy Fail
						echo 'deploy CSC'
						script{
							try {
                                deploy adapters: [tomcat9(credentialsId: TOMCAT_CRIDEN_ID, path: '', url: TOMCAT1_URL)], contextPath: TOMCAT_DEPLOY_CONTEXT_CSC_DEV_TEMP_PATH, war: 'configs/dev_temp/csc-dev-temp.war'
							} catch(error) {
								echo "First deploy failed, let's retry"
								sleep 10
								retry(1) {
                                    deploy adapters: [tomcat9(credentialsId: TOMCAT_CRIDEN_ID, path: '', url: TOMCAT1_URL)], contextPath: TOMCAT_DEPLOY_CONTEXT_CSC_DEV_TEMP_PATH, war: 'configs/dev_temp/csc-dev-temp.war'
								}
							}
						}
						script{
							try {
								deploy adapters: [tomcat9(credentialsId: TOMCAT_CRIDEN_ID, path: '', url: TOMCAT2_URL)], contextPath: TOMCAT_DEPLOY_CONTEXT_CSC_DEV_TEMP_PATH, war: 'configs/dev_temp/csc-dev-temp.war'
							} catch(error) {
								echo "First deploy failed, let's retry"
								sleep 10
								retry(1) {
									deploy adapters: [tomcat9(credentialsId: TOMCAT_CRIDEN_ID, path: '', url: TOMCAT2_URL)], contextPath: TOMCAT_DEPLOY_CONTEXT_CSC_DEV_TEMP_PATH, war: 'configs/dev_temp/csc-dev-temp.war'
								}
							}
						}

						echo "Deploy successful";
					}
				}
            }
            post {
                success {
                    /*ถ้า Test ผ่านจา่ะตัด Alpha Release*/
                    echo 'Tag Pre Alpha Release'
                    script{
                        if(currentBuild.result == "SUCCESS"){
                            catchError(buildResult: 'SUCCESS',stageResult: 'SUCCESS') {
                                sh "git tag -d ${TAG_NAME_PRE_ALPHA_RELEASE}"
                            }
                            
                            sh "git tag ${TAG_NAME_PRE_ALPHA_RELEASE}" 

                            catchError(buildResult: 'SUCCESS',stageResult: 'SUCCESS') {
                                sh "git push --delete http://$GITLAB_CRIDEN_USR:$GITLAB_CRIDEN_PSW@10.100.1.7:9080/PNG_IAPI/SourceCode/WEB/CSC/csc.git ${TAG_NAME_PRE_ALPHA_RELEASE}"					
                            }
                            
                            sh "git push http://$GITLAB_CRIDEN_USR:$GITLAB_CRIDEN_PSW@10.100.1.7:9080/PNG_IAPI/SourceCode/WEB/CSC/csc.git ${TAG_NAME_PRE_ALPHA_RELEASE}"					
                            
                        }
                    }
                }				
            }    
        }

        stage('Build And Deploy ALPHA') {
            when { 
                expression { 
                    params['BuildDev']
                }
            }	
            stages {
				stage('Check Aborted'){
					steps {
						/*V 1.4.0*/
						script {
							currentBuild.displayName = currentBuild.displayName + "  :  ALPHA"
						}

						script{
							/*V 1.2.0*****/
							def builds = []
							def job = Jenkins.instance.getItem("${env.JOB_NAME}")

							job.builds.find{
								// รอบแรกให้ Set เป็น false ก่อน
								if(it.result == hudson.model.Result.SUCCESS){
									def is_BuildDev = it.actions.find{it instanceof ParametersAction}?.parameters.find{it.name == "BuildDev"}?.value
									echo "Found Success and is_BuildDev = ${is_BuildDev} and Build Number = ${it.number}" 
									if(is_BuildDev == true){
										echo "it = ${it}"

										// รอบแรก Commment Code ส่วนที่เรียกใช้ GIT_COMMIT_DEV_SUCCESS_RIVISION ไว้ด้วย
										GIT_COMMIT_DEV_SUCCESS_RIVISION = it.actions.find{it instanceof hudson.plugins.git.util.BuildData}?.lastBuild // Script Must Allow
										if(GIT_COMMIT_DEV_SUCCESS_RIVISION != null){
											return true
										}
									}
								}
							}
							/**************/
						}
						/*Sample Data = Build #67 of Revision 8f5389aae55c96b5c5f25f41e2455018214e55f4 (refs/tags/2022.02.00-PRE-ALPHA-RELEASE)*/
						echo "last Rivision =  ${GIT_COMMIT_DEV_SUCCESS_RIVISION}"

						script{
							/*V1.3.1 Debug  เปรียบเทียบกับ TAG_NAME_PRE_ALPHA_RELEASE*/
							String gitRevision = sh (lable:'git_rivision',returnStdout:true,script:'git rev-parse $TAG_NAME_PRE_ALPHA_RELEASE').trim()
							echo "gitRevision =  ${gitRevision}"
							echo "Force Build = ${params['ForceBuildDev']}"

							/*V 1.2.0*****/
							// รอบแรกให้ Set เป็น false ก่อน
							if(GIT_COMMIT_DEV_SUCCESS_RIVISION.toString().contains(gitRevision)){
								if(params['ForceBuildDev'] != true) {
									NO_ABORTED = false

									echo 'Aborted'
									catchError(buildResult: 'ABORTED',stageResult: 'ABORTED') {
										error('Aborted By No Change')
									}
								}
							} else {
								NEW_REVISION = true
							}							
						}						
					}
				}

				stage('No Aborted'){
					when { 
						expression { 
							NO_ABORTED
						}
					}

					stages {
						stage('Check Out'){
							steps {
								script{
									if(NEW_REVISION){
										echo 'Found new rivision.'
									}
									echo 'Building'
								}

								//git branch: BRANCH, credentialsId: GITLAB_CRIDEN_ID, url: URL_GIT_REPO
								checkout([$class: 'GitSCM', branches: [[name: 'refs/tags/'+TAG_NAME_PRE_ALPHA_RELEASE]], extensions: [], userRemoteConfigs: [[credentialsId: GITLAB_CRIDEN_ID, url: URL_GIT_REPO]]])

								sh 'npm -version'
								sh 'node --version'
								sh 'npm install'
								sh 'npm rebuild node-sass'
							}
						}

						stage('Build'){
							steps {
								parallel (
									csc : {
										sh 'node --max_old_space_size=2048 node_modules/.bin/ng build --configuration=dev --output-path=dist/dev/csc --base-href=/csc-dev/ --aot=true'
									}
								)
							}
						}

						stage('Deploy'){
							steps {
								sh 'ant addBuildNumber_Dev'
								sh 'ant build_csc_dev_war'

								/*Deploy Dev Temp*/
								//1. ต้องลง Plugin Deploy Container ถึงจะใช้ command deploy ได้  /  2. ต้องสร้าง Credential
								//1.11.0  งาน App , WS เพิ่ม Catch error และ Retry 1 รอบกรณี Deploy Fail
								echo 'deploy CSC'
								script{
									try {
										deploy adapters: [tomcat9(credentialsId: TOMCAT_CRIDEN_ID, path: '', url: TOMCAT1_URL)], contextPath: TOMCAT_DEPLOY_CONTEXT_CSC_DEV_PATH, war: 'configs/dev/csc-dev.war'
									} catch(error) {
										echo "First deploy failed, let's retry"
										sleep 10
										retry(1) {
											deploy adapters: [tomcat9(credentialsId: TOMCAT_CRIDEN_ID, path: '', url: TOMCAT1_URL)], contextPath: TOMCAT_DEPLOY_CONTEXT_CSC_DEV_PATH, war: 'configs/dev/csc-dev.war'
										}
									}
								}
								script{
									try {
										deploy adapters: [tomcat9(credentialsId: TOMCAT_CRIDEN_ID, path: '', url: TOMCAT2_URL)], contextPath: TOMCAT_DEPLOY_CONTEXT_CSC_DEV_PATH, war: 'configs/dev/csc-dev.war'
									} catch(error) {
										echo "First deploy failed, let's retry"
										sleep 10
										retry(1) {
											deploy adapters: [tomcat9(credentialsId: TOMCAT_CRIDEN_ID, path: '', url: TOMCAT2_URL)], contextPath: TOMCAT_DEPLOY_CONTEXT_CSC_DEV_PATH, war: 'configs/dev/csc-dev.war'
										}
									}
								}

								echo "Deploy successful";
							}
						}
					}
				}
			}


            post {
                success {
                        /*ถ้า Test ผ่านจา่ะตัด Alpha Release*/
                    script{
                        if(currentBuild.result == "SUCCESS"){

                            catchError(buildResult: 'SUCCESS',stageResult: 'SUCCESS') {
                                sh "git tag -d ${TAG_NAME_ALPHA_RELEASE}"
                            }
                            
                            sh "git tag ${TAG_NAME_ALPHA_RELEASE}" 

                            catchError(buildResult: 'SUCCESS',stageResult: 'SUCCESS') {
                                sh "git push --delete http://$GITLAB_CRIDEN_USR:$GITLAB_CRIDEN_PSW@10.100.1.7:9080/PNG_IAPI/SourceCode/WEB/CSC/csc.git ${TAG_NAME_ALPHA_RELEASE}"					
                            }
                            
                            sh "git push http://$GITLAB_CRIDEN_USR:$GITLAB_CRIDEN_PSW@10.100.1.7:9080/PNG_IAPI/SourceCode/WEB/CSC/csc.git ${TAG_NAME_ALPHA_RELEASE}"					
                            
                        }
                    }
                }				
            }    
        }

        stage('Manual confirm tag for production'){
			when { 
				expression { 
					params['ReleaseTag']
				}
			}
			steps {
				echo "Ask for confirm."
				script {
				  env.TAG_APP_VERSION = input message: 'Confirm For Production Tag Release V.'+params.APPVERSION, parameters: [string(defaultValue: '', description: '', name: 'Type version for confirm.', trim: false)]
				}			
			}
		}

        stage('Tag'){
			when { 
				expression { 
                    echo 'APPVERSION:'+params.APPVERSION 
                    echo 'TAG_APP_VERSION:'+env.TAG_APP_VERSION 
                    echo 'ReleaseTag:'+params['ReleaseTag'] 
					params.APPVERSION == env.TAG_APP_VERSION  && params['ReleaseTag']
				}
			}
			stages {
				stage('Prepare Tag'){
					steps {
						script {
							currentBuild.displayName = currentBuild.displayName + "  :  TAG   🏷️"
						}				
						
						/*ดึง Revision จาก Dev Success*/
						checkout([$class: 'GitSCM', branches: [[name: 'refs/tags/'+TAG_NAME_ALPHA_RELEASE]], extensions: [], userRemoteConfigs: [[credentialsId: GITLAB_CRIDEN_ID, url: URL_GIT_REPO]]])

						sh 'git rev-parse HEAD'
						sh 'npm install'
                        sh 'npm rebuild node-sass'
					}				
				}

				stage('Build'){
                    steps {
						parallel (
							cert : {
								sh 'node --max_old_space_size=2048 node_modules/.bin/ng build --configuration=cert.csc --output-path=dist/cert/csc --base-href=/csc/ --aot=true'
							},
							pre : {
								sh 'node --max_old_space_size=2048 node_modules/.bin/ng build --configuration=pre.csc --output-path=dist/pre/csc --base-href=/csc/ --aot=true'
							},
							prod : {
								sh 'node --max_old_space_size=2048 node_modules/.bin/ng build --configuration=prod.csc --output-path=dist/prod/csc --base-href=/csc/ --aot=true'
							}
						)
                    }
				}

				stage('Pack'){
					steps {
						sh 'ant addBuildNumberUat'
						sh 'ant addBuildNumberPre'
                        sh 'ant addBuildNumberProd'

						sh 'ant build_uat_war'
						sh 'ant build_pre_war'
                        sh 'ant build_prod_war'
                        sh 'ant build_installation'	
					}
				}

				stage('Push Tag to gitlab'){
                    /*ถ้า Test ผ่านจา่ะตัด Alpha Release*/
					steps {
						sh "git tag ${env.APP_VERSION}" 
						sh "git push http://$GITLAB_CRIDEN_USR:$GITLAB_CRIDEN_PSW@10.100.1.7:9080/PNG_IAPI/SourceCode/WEB/CSC/csc.git ${env.APP_VERSION}"					
						
						echo 'Copy Artifact'
						//archiveArtifacts artifacts: 'target/dev/*.war', followSymlinks: false				
						archiveArtifacts artifacts: 'installation/**/*.*', followSymlinks: true								
					}

                    post {
                        success {
                            /**ลบ เมื่อ  success*/
                            script{
                                if(currentBuild.result == "SUCCESS"){

                                    catchError(buildResult: 'SUCCESS',stageResult: 'SUCCESS') {
                                        sh "git tag -d ${TAG_NAME_PRE_ALPHA_RELEASE}"
                                    }							

                                    catchError(buildResult: 'SUCCESS',stageResult: 'SUCCESS') {
                                        sh "git tag -d ${TAG_NAME_ALPHA_RELEASE}"
                                    }

                                    catchError(buildResult: 'SUCCESS',stageResult: 'SUCCESS') {
                                        sh "git push --delete http://$GITLAB_CRIDEN_USR:$GITLAB_CRIDEN_PSW@10.100.1.7:9080/PNG_IAPI/SourceCode/WEB/CSC/csc.git ${TAG_NAME_PRE_ALPHA_RELEASE}"					
                                    }

                                    catchError(buildResult: 'SUCCESS',stageResult: 'SUCCESS') {
                                        sh "git push --delete http://$GITLAB_CRIDEN_USR:$GITLAB_CRIDEN_PSW@10.100.1.7:9080/PNG_IAPI/SourceCode/WEB/CSC/csc.git ${TAG_NAME_ALPHA_RELEASE}"					
                                    }
                                }
                            }
                        }				
                    } 					
				}
			}
	    }	
    }
}
