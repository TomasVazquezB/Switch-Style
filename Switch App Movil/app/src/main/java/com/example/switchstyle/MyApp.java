package com.example.switchstyle;

import android.app.Activity;
import android.app.Application;
import android.os.Bundle;
import android.util.Log;

import com.google.firebase.auth.FirebaseAuth;

public class MyApp extends Application {

    private int activityReferences = 0;
    private boolean isActivityChangingConfigurations = false;

    @Override
    public void onCreate() {
        super.onCreate();

        registerActivityLifecycleCallbacks(new ActivityLifecycleCallbacks() {
            @Override
            public void onActivityStarted(Activity activity) {
                if (++activityReferences == 1 && !isActivityChangingConfigurations) {
                    Log.d("MyApp", "App volvió al foreground");
                }
            }

            @Override
            public void onActivityStopped(Activity activity) {
                isActivityChangingConfigurations = activity.isChangingConfigurations();
                if (--activityReferences == 0 && !isActivityChangingConfigurations) {
                    Log.d("MyApp", "App en background. Cerrando sesión.");
                    FirebaseAuth.getInstance().signOut();
                }
            }

            @Override public void onActivityCreated(Activity activity, Bundle savedInstanceState) {}
            @Override public void onActivityResumed(Activity activity) {}
            @Override public void onActivityPaused(Activity activity) {}
            @Override public void onActivitySaveInstanceState(Activity activity, Bundle outState) {}
            @Override public void onActivityDestroyed(Activity activity) {}
        });
    }
}
