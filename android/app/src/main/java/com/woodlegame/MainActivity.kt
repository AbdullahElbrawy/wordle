package com.woodlegame

import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint

class MainActivity : ReactActivity() {

    override fun getMainComponentName(): String? {
        return "woodlegame"
    }

    override fun createReactActivityDelegate(): ReactActivityDelegate {
        return DefaultReactActivityDelegate(
            this,
            mainComponentName!!,
            DefaultNewArchitectureEntryPoint.fabricEnabled, // fabricEnabled
            DefaultNewArchitectureEntryPoint.concurrentReactEnabled // concurrentRootEnabled
        )
    }
}
