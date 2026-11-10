plugins { id("com.android.application") }

android {
    namespace = "kr.aptgame.johapjang"
    compileSdk = 35
    defaultConfig {
        applicationId = "kr.aptgame.johapjang"
        minSdk = 24
        targetSdk = 35
        versionCode = (System.getenv("VERSION_CODE") ?: "1").toInt()
        versionName = "1.0." + (System.getenv("VERSION_CODE") ?: "1")
    }
    buildTypes {
        release { isMinifyEnabled = false }
    }
    compileOptions { sourceCompatibility = JavaVersion.VERSION_17; targetCompatibility = JavaVersion.VERSION_17 }
}

dependencies { implementation("androidx.webkit:webkit:1.12.1") }
