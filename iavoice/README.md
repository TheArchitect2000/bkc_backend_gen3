
[![bkc-node](https://i.pcmag.com/imagery/articles/02cAFHgCLcU6qsNAQgUrfl2-14.fit_lim.size_1600x900.v1623939967.jpg)]()

# How to enable voice commands in bkc-node

In order to enable voice commands via Alexa or Google Assistant for a node, follow the next instructure:

### 1. Setting up your Webhook
1. Download or clone the "iavoice" repo.
2. Run the code on the server using NodeJs or PM2.
```sh
$ cd iavoice
$ sudo npm install
$ node src/index.js
## Alternative
$ pm2 start src/index.js
```
3. Update your Nginx web server config file to redirect https traffic from `https://your.node.server/webhook_alexa` and `https://your.node.server/webhook_google`
   to port 9122 like bellow
   ```
   sample Nginx redirect
   ```
   

### 2. Alexa Setting
1. Create an <a href="https://developer.amazon.com/alexa/console/ask">Amazon developer account</a>.
2. Download the schema definition file named <a href="assets/BKC-Alexa-Schema.json">BKC-Alexa-Schema.json</a> from the BKC git repository.
3. Navigate to the "Json Editor" page in the Alexa console and upload the json file.
4. Click on the "Save Model" button.
5. Click on the "Build Model" button.
6. Go to the Endpoint menu.
7. Select "HTTPS".
8. In the "Default Region" box, set your webhook URL `i.e. https://your.node.server/webhook_alexa`
9. In the certificate box, select the "My development endpoint has a certificate from a trusted certificate authority" item.
10. Click the "Save Endpoints" button.
    ![img.png](assets/alexa-endpoints.png)

### 3. Google Assistant Setting
1. Create a <a href="https://dialogflow.cloud.google.com/">Google developer account</a>.
2. Go to the <a href="https://dialogflow.cloud.google.com/">Dialogflow panel</a>.
3. Create a new "Agent".
4. Download the <a href="assets/BKCVoiceAgent.zip">BKCVoiceAgent.zip</a> file from the BKC Node GitHub.
5. In Dialogflow, go to "Settings" and the "Export and Import" tab.
6. Upload the zip file on your developer account using the "RESTORE FROM ZIP" button.
   ![dialogflow-import](assets/dialogflow-import.png)
7. Go to the "Fullfillment" menu and set your webhook URL to `https://your.node.server/webhook_google`
   ![dialogflow-fullfillment](assets/dialogflow-fullfill.png)
8. Click the "SAVE" button on the bottom of the page.
