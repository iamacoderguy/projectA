define({ "api": [
  {
    "type": "get",
    "url": "/",
    "title": "1. go to dashboard page",
    "group": "A_client",
    "permission": [
      {
        "name": "none"
      }
    ],
    "description": "<p>It will return API dashboard when client is a normal user</p> <p>It will return Admin dashboard when client is an Admin</p>",
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "Number",
            "optional": false,
            "field": "status",
            "description": "<p>200</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/client.js",
    "groupTitle": "A_client",
    "name": "Get"
  },
  {
    "type": "post",
    "url": "/api/auth/connect",
    "title": "1. connect to server",
    "group": "B_auth",
    "permission": [
      {
        "name": "none (for making new connect) || connected users (for refreshing token)"
      }
    ],
    "header": {
      "fields": {
        "Header (optional)": [
          {
            "group": "Header (optional)",
            "type": "String",
            "optional": false,
            "field": "x-auth-token",
            "description": "<p>The token got from /api/auth/connect. Only needed when refreshing the connection.</p>"
          }
        ]
      }
    },
    "description": "<p>It will (make a new / refresh current) connection between the client and the server</p>",
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "Number",
            "optional": false,
            "field": "status",
            "description": "<p>200</p>"
          },
          {
            "group": "Success",
            "type": "String",
            "optional": false,
            "field": "body",
            "description": "<p>The token</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImQ2M2Q3MWVlOGU3Zjk2Y2ZlYTk4MTllOWI5ZGNiNWY0IiwiaXNBZG1pbiI6dHJ1ZSwiZXhwQ29kZSI6MTU2NzU5MjA2NDAwMCwiaWF0IjoxNTY3NTkyMDY0LCJleHAiOjE1Njc1OTI5NjR9.bqtY5HAA6CToZk6bVtIoGbZP880MdgtSZmksQ0QevZg",
          "type": "string"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/auth.js",
    "groupTitle": "B_auth",
    "name": "PostApiAuthConnect"
  },
  {
    "type": "post",
    "url": "/api/auth/disconnect",
    "title": "2. disconnect from server",
    "group": "B_auth",
    "permission": [
      {
        "name": "connected users"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-auth-token",
            "description": "<p>The token got from /api/auth/connect</p>"
          }
        ]
      }
    },
    "description": "<p>It will remove the connection between the client and the server</p>",
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "Number",
            "optional": false,
            "field": "status",
            "description": "<p>200</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/auth.js",
    "groupTitle": "B_auth",
    "name": "PostApiAuthDisconnect"
  },
  {
    "type": "get",
    "url": "/api/files",
    "title": "1. get the shared files list",
    "group": "C_files",
    "permission": [
      {
        "name": "connected users"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-auth-token",
            "description": "<p>The token got from /api/auth/connect</p>"
          }
        ]
      }
    },
    "description": "<p>It will return the list of files in the shared folder</p>",
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "Number",
            "optional": false,
            "field": "status",
            "description": "<p>200</p>"
          },
          {
            "group": "Success",
            "type": "String[]",
            "optional": false,
            "field": "body",
            "description": "<p>List of shared files</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "[\n    \"file 1.ext\",\n    \"file 2.ext\"\n]",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/files.js",
    "groupTitle": "C_files",
    "name": "GetApiFiles"
  },
  {
    "type": "get",
    "url": "/api/files/:filename",
    "title": "2. get a shared file",
    "group": "C_files",
    "permission": [
      {
        "name": "connected users"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-auth-token",
            "description": "<p>The token got from /api/auth/connect</p>"
          }
        ]
      }
    },
    "description": "<p>It will return a shared file in the shared folder</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "filename",
            "description": "<p>The shared file's name</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "Number",
            "optional": false,
            "field": "status",
            "description": "<p>200</p>"
          },
          {
            "group": "Success",
            "type": "file",
            "optional": false,
            "field": "body",
            "description": "<p>The shared file</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/files.js",
    "groupTitle": "C_files",
    "name": "GetApiFilesFilename"
  },
  {
    "type": "post",
    "url": "/api/files",
    "title": "3. upload a file",
    "group": "C_files",
    "permission": [
      {
        "name": "connected users"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-auth-token",
            "description": "<p>The token got from /api/auth/connect</p>"
          }
        ]
      }
    },
    "description": "<p>It will upload a file to the shared folder</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "file",
            "description": "<p>The file via multipart/form-data</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "Number",
            "optional": false,
            "field": "status",
            "description": "<p>200</p>"
          },
          {
            "group": "Success",
            "type": "String",
            "optional": false,
            "field": "body",
            "description": "<p>The filename on server</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "filename_1.ext",
          "type": "string"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/files.js",
    "groupTitle": "C_files",
    "name": "PostApiFiles"
  },
  {
    "type": "put",
    "url": "/api/files/path",
    "title": "4. change the shared folder",
    "group": "C_files",
    "permission": [
      {
        "name": "admin"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-auth-token",
            "description": "<p>The token got from /api/auth/connect</p>"
          }
        ]
      }
    },
    "description": "<p>It will change the shared folder's path</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "file",
            "description": "<p>The file via multipart/form-data</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "Number",
            "optional": false,
            "field": "status",
            "description": "<p>200</p>"
          },
          {
            "group": "Success",
            "type": "String[]",
            "optional": false,
            "field": "body",
            "description": "<p>List of shared files</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "[\n    \"file 1.ext\",\n    \"file 2.ext\"\n]",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/files.js",
    "groupTitle": "C_files",
    "name": "PutApiFilesPath"
  }
] });
