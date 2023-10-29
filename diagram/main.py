# diagram.py
from diagrams import Cluster, Diagram
from diagrams.gcp.analytics import PubSub
from diagrams.gcp.analytics import Composer
from diagrams.generic.network import Router
from diagrams.generic.place import Datacenter
from diagrams.gcp.analytics import Dataproc
from diagrams.gcp.compute import Functions
from diagrams.gcp.storage import Storage as CloudStorage
from diagrams.gcp.database import BigTable
from diagrams.saas.chat import Slack
from diagrams.programming.flowchart import Decision
from diagrams.gcp.database import Firestore
from diagrams.gcp.api import Endpoints
from diagrams.gcp.api import APIGateway

with Diagram("Vehicle Telematics Pipeline", show=False):
    with Cluster("Sources"):
        d_logs=Datacenter("Description\nlogs")
        t_logs=Datacenter("Telematics\nlogs")
        vehicle=Router("Vehicle\nMessages")

        
    with Cluster("Google Cloud Platform"):
        pubSub=PubSub("PubSub")    

        with Cluster("Cloud Storage"):
            cloudStorage1=CloudStorage("Storage\n(Telematics)")
            cloudStorage2=CloudStorage("Storage\n(Descriptions)")
    

        with Cluster("Databases"):
            firestore=Firestore("Firestore\n(Descriptions)")
            bigTable=BigTable("BigTable\n(Telematics)")

        with Cluster("Composer DAG for Telematics"):
            composer1=Composer("Cloud Composer")
            dataproc=Dataproc("Dataproc + Spark")
            slackTelematics=Slack("Slack")

        d_cloud_function=Functions("Cloud Function\n(Descriptions)")
        vehicle >> pubSub
        t_logs >> cloudStorage1
        cloudStorage1 >> bigTable
        pubSub >> dataproc
        composer1 >> dataproc
        dataproc >> bigTable
        dataproc >> slackTelematics
        
        d_logs >> cloudStorage2
        cloudStorage2 >> firestore
        pubSub >> d_cloud_function
        d_cloud_function >> firestore       
           
        cloud_function=Functions("Cloud Function\nfor API")
        api_gateway=APIGateway("API Gateway")

        with Cluster("Endpoints"):
            endpoint1=Endpoints("GET\nVehicle only\n(description\noptional)")
            endpoint2=Endpoints("GET\nRange only\n(description\noptional)")
            endpoint3=Endpoints("GET\nVehicle and Range\n(description\noptional)")
        
        bigTable << cloud_function
        firestore << cloud_function
        cloud_function << api_gateway
        api_gateway << [endpoint1, endpoint2, endpoint3]
