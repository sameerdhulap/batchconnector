//
//  Woosmap.swift
//  MarketingConnector
//
//  Created by WGS on 08/10/24.
//

import Foundation
import WoosmapGeofencing
import react_native_plugin_geofencing

extension Notification.Name {
  static let updateRegions = Notification.Name("updateRegions")
  static let didEventPOIRegion = Notification.Name("didEventPOIRegion")
}

@objc(GeofencingEventsReceiver)
class GeofencingEventsReceiver: NSObject {
  @objc public func startReceivingEvent() {
    NotificationCenter.default.addObserver(self, selector: #selector(POIRegionReceivedNotification),
                                           name: .didEventPOIRegion,
                                           object: nil)
  }
  @objc func POIRegionReceivedNotification(notification: Notification) {
    if let POIregion = notification.userInfo?["Region"] as? Region{
      // YOUR CODE HERE
      if POIregion.didEnter {
        NSLog("didEnter")
      }
      else{
        NSLog("didExit")
      }
      executeNotification(region: POIregion )
    }
  }
  // Stop receiving notification
  @objc public func stopReceivingEvent() {
    NotificationCenter.default.removeObserver(self, name: .didEventPOIRegion, object: nil)
  }
  
  // Test background event with notification
  private func executeNotification(region: Region){
    Task {
      let content = UNMutableNotificationContent()
      
      if let moreInfo = POIs.getPOIbyIdStore(idstore: region.identifier){
        content.body += "\(region.didEnter ? "Entered Region" : "Exited Region") \(moreInfo.name ?? "-")"
      }
      else{
        if region.didEnter {
          content.title = "Exited Region \(region.identifier)"
          content.body = "please come back"
        }
        else{
          content.title = "Entered Region \(region.identifier)"
          content.body = "Welcome here"
        }
      }
      
      let uuidString = UUID().uuidString
      let request = UNNotificationRequest(identifier: uuidString, content: content, trigger: nil)
      
      // Schedule the request with the system.
      let notificationCenter = UNUserNotificationCenter.current()
      do {
        try await notificationCenter.add(request)
      } catch {
        // Handle errors that may occur during add.
      }
    }
  }
}

