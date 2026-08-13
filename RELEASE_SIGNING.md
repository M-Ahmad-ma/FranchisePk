# Release Keystore Credentials

> ⚠️ **SENSITIVE — DO NOT COMMIT TO GIT.** Keep this file private.
> These credentials sign the release APK. Losing them means you cannot update the app on Play Store.

## Keystore File
| Field | Value |
|---|---|
| Location | `android/app/release.keystore` |
| Format | JKS (Java KeyStore) |
| Validity | 10,000 days |
| Key algorithm | RSA 2048 |

## Credentials
| Field | Value |
|---|---|
| **Key Alias** | `franchisepk` |
| **Store Password** | `FranchisePk@2026` |
| **Key Password** | `FranchisePk@2026` |

## Certificate Details
| Field | Value |
|---|---|
| CN | FranchisePk |
| O | FranchisePk |
| L | Lahore |
| S | Punjab |
| C | PK |

## How Signing Is Wired

Credentials are loaded from `android/keystore.properties`:

```properties
MYAPP_RELEASE_STORE_FILE=release.keystore
MYAPP_RELEASE_KEY_ALIAS=franchisepk
MYAPP_RELEASE_STORE_PASSWORD=FranchisePk@2026
MYAPP_RELEASE_KEY_PASSWORD=FranchisePk@2026
```

`android/app/build.gradle` reads this file and applies it to the `release` build type.

## Build & Verify

```bash
# Build signed release APK
cd android && ./gradlew assembleRelease

# Output
# android/app/build/outputs/apk/release/app-release.apk

# Verify signature
apksigner verify --print-certs app-release.apk
# Look for: CN=FranchisePk
```

## Regenerate (if lost)

```bash
keytool -genkeypair -v \
  -keystore android/app/release.keystore \
  -alias franchisepk \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -storepass "FranchisePk@2026" -keypass "FranchisePk@2026" \
  -dname "CN=FranchisePk, OU=Dev, O=FranchisePk, L=Lahore, S=Punjab, C=PK"
```
