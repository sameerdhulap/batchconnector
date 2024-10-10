package com.marketingconnector;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.util.Log;

public class GeofencingEventsReceiver extends BroadcastReceiver {
    private static final String TAG = "GeofencingReceiver";
    @Override
    public void onReceive(Context context, Intent intent) {
        Log.d(TAG, "Received broadcast");
        /// YOUR BATCH CODE HERE
    }

}
