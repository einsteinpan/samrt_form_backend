const { GoogleAuth } = require('google-auth-library');

exports.analyzeText = async function(text) {
    const auth = new GoogleAuth({
        keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
        scopes: ['https://www.googleapis.com/auth/cloud-platform'],
    });

    const client = await auth.getClient();
    const projectId = await auth.getProjectId();
    const url = `https://language.googleapis.com/v1/documents:analyzeEntities?key=${projectId}`;

    const response = await client.request({
        url: url,
        method: 'POST',
        data: {
            document: {
                type: 'PLAIN_TEXT',
                content: text
            }
        }
    });

    return response.data;
}