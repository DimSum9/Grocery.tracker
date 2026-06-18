package com.april.grocerytracker;

import android.Manifest;
import android.content.pm.PackageManager;
import android.os.Bundle;
import java.util.ArrayList;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    // The web app uses navigator.mediaDevices (barcode/receipt scanning) and
    // navigator.geolocation (auto-detect tax location). The WebView can only use
    // these if the app itself holds the runtime permissions, so request any that
    // are still missing the first time the app launches.
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        String[] needed = {
            Manifest.permission.CAMERA,
            Manifest.permission.ACCESS_FINE_LOCATION,
            Manifest.permission.ACCESS_COARSE_LOCATION
        };
        ArrayList<String> toRequest = new ArrayList<>();
        for (String p : needed) {
            if (ContextCompat.checkSelfPermission(this, p) != PackageManager.PERMISSION_GRANTED) {
                toRequest.add(p);
            }
        }
        if (!toRequest.isEmpty()) {
            ActivityCompat.requestPermissions(this, toRequest.toArray(new String[0]), 1001);
        }
    }
}
