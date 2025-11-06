package com.example.switchstyle;

import android.app.Activity;
import android.app.Application;
import android.os.Bundle;
import android.util.Log;
import androidx.annotation.NonNull;
import com.example.switchstyle.api.SessionManager;

public class MyApp extends Application {
    private int activityReferences = 0;
    private boolean isActivityChangingConfigurations = false;
    private SessionManager session;

    @Override
    public void onCreate() {
        super.onCreate();

        session = new SessionManager(this);

        registerActivityLifecycleCallbacks(new ActivityLifecycleCallbacks() {
            @Override
            public void onActivityStarted(@NonNull Activity activity) {
                if (++activityReferences == 1 && !isActivityChangingConfigurations) {
                    Log.d("MyApp", "App volvió al foreground");
                }
            }
            @Override
            public void onActivityStopped(@NonNull Activity activity) {
                isActivityChangingConfigurations = activity.isChangingConfigurations();
                if (--activityReferences == 0 && !isActivityChangingConfigurations) {
                    Log.d("MyApp", "⏸ App en background. Cerrando sesión");
                    session.clearSession();
                }
            }
            @Override public void onActivityCreated(@NonNull Activity activity, Bundle savedInstanceState) {}
            @Override public void onActivityResumed(@NonNull Activity activity) {}
            @Override public void onActivityPaused(@NonNull Activity activity) {}
            @Override public void onActivitySaveInstanceState(@NonNull Activity activity, @NonNull Bundle outState) {}
            @Override public void onActivityDestroyed(@NonNull Activity activity) {}
        });
    }
}