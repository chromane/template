// import { Bucket } from "@google-cloud/storage";
import { auth, GoogleAuth } from "google-auth-library";
import { decode_jwt } from "@chromane/shared/ts/util";
import Stripe from "stripe";
const { google } = require("googleapis");
// import { FirebaseApp, initializeApp } from "firebase/app";
// import { GoogleAuthProvider, createUserWithEmailAndPassword, getAuth, signInWithCredential, signInWithEmailAndPassword } from "firebase/auth";
import sgMail from "@sendgrid/mail";
import { BackendCodes } from "@chromane/shared/types/types";
import { encode_json } from "@chromane/shared/ts/helpers";

let _config: any = {};
let _secrets: any = {};
// let _admin: admin.app.App;

class Common {
  backend: BackendDefault;
  constructor(backend) {
    this.backend = backend;
  }
  async ping() {
    return "pong";
  }
  async send_user_feedback(data) {
    if (data.client_id === "website") {
      // gc_log("website", data);
      sgMail.setApiKey(_secrets.sendgrid_api_key);
      //
      const msg = {
        to: "vlas@chromane.com",
        from: {
          email: "bot@chromane.com",
          name: "Chromane",
        },
        subject: `Message from ${data.hostname}`,
        html: `
            <b>Name:</b><br></br>
            <i>${data.name}</i><br></br><br></br>
            <b>Email:</b><br></br>
            <i>${data.email}</i><br></br><br></br>
            <b>Message:</b><br></br>
            <i>${data.message}</i>
            `,
      };
      await sgMail.send(msg);
      return { code: BackendCodes.SUCCESS };
    } else {
      return null;
    }
  }
  async gc_log(payload) {
    let access_token = await this.backend.internal.auth.getAccessToken();
    let url = `https://logging.googleapis.com/v2/entries:write`;
    let log_id = "chromane";
    let body = {
      // logName: "ryan_ghassabian",
      entries: [
        {
          logName: `projects/${this.backend.internal.config.gc_id}/logs/${log_id}`,
          resource: {
            type: "global",
            labels: {
              project_id: "chromane",
            },
          },
          jsonPayload: payload,
        },
      ],
    };
    await fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
      body: encode_json(body),
    });
  }
  async redirect(query_params) {
    return {
      _redirect: true,
      location: `chrome-extension://${_config.extension_id}/pages/redirect/index.html?state=${query_params.state}`,
    };
  }
}

class Internal {
  config: any;
  secrets: any;
  auth: GoogleAuth;
  // admin: admin.app.App;
  constructor(config, secrets) {
    _config = config;
    _secrets = secrets;
    this.secrets = secrets;
    this.config = config;
    let auth = new GoogleAuth({ credentials: this.secrets.service_account });
    this.auth = auth;
    // _admin = admin.initializeApp({
    //   credential: cert(_secrets.google_service_account as admin.ServiceAccount),
    // });
    // this.admin = _admin;
  }
  create_auth_client(redirect_uri) {
    let client_id = _config.google_client_id;
    let client_secret = _secrets.google_client_secret;
    const oauth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uri);
    return oauth2Client;
  }
}

export default class BackendDefault {
  // props
  // jwt_claims: any;
  // config: any;
  // secrets: any;
  // //
  // app: any;
  // db: admin.firestore.Firestore;
  // bucket: Bucket;
  // modules = {
  //   chromane: {

  //   },
  // };
  // init
  internal: Internal;
  common: Common;
  constructor(config, secrets) {
    this.internal = new Internal(config, secrets);
    this.common = new Common(this);
    // _secrets = secrets;
    // this.jwt_claims = jwt_claims;
    // this.config = config;
    // this.secrets = secrets;
    // //
    // this.app = admin.initializeApp({
    //   credential: cert(secrets.service_account as admin.ServiceAccount),
    //   storageBucket: config.firebase_config.storageBucket,
    // });
    // this.db = this.app.firestore();
    // this.bucket = admin.storage().bucket();
  }
  //
}
