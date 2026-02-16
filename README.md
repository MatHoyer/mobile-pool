firebase config:

```
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    match /{document=**} {

      allow read: if request.auth != null
                  && resource.data.email == request.auth.token.email;

      allow create: if request.auth != null
                    && request.resource.data.email == request.auth.token.email;

      allow update: if request.auth != null
                    && resource.data.email == request.auth.token.email
                    && request.resource.data.email == request.auth.token.email;

      allow delete: if request.auth != null
                    && resource.data.email == request.auth.token.email;
    }
  }
}
```
