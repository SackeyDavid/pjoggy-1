import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { doc, setDoc, arrayRemove, arrayUnion } from "firebase/firestore"; 
import firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class VideoChatService {

  constructor(
    private firestore: AngularFirestore
  ) { }

  
  getRaisedHandsDoc(event_id: string) {
    return this.firestore
    .collection('raised-hands')
    .doc('EV-'+ event_id)
    .valueChanges()
  }

  saveRaiseHand(event_id: string, callData: any) {
    const firstDocRef = this.firestore.collection('raised-hands').doc('EV-'+ event_id);
    firstDocRef.get().subscribe((resDoc)=>{
        if(resDoc.exists)
        {
        // if(this.firestore.collection('raised-hands').doc('EV-'+ event_id)) {
        
            this.firestore.doc(`raised-hands/EV-${event_id}`).update({
              raisedHands: arrayUnion(callData)
            })
            // console.log('found raised-hands document');
        
        } else {
          this.firestore.collection('raised-hands').doc('EV-'+ event_id).set({raisedHands: callData});
          // console.log('not found raised-hands document');
        }
      });

  }

  deleteRaiseHand(event_id: string, callData: any) {
    if(this.firestore.collection('raised-hands').doc('EV-'+ event_id)) {
    
         this.firestore.doc(`raised-hands/EV-${event_id}`).update({
          raisedHands: arrayRemove(callData)
         })
        //  console.log('found raised-hands document')
    
    } else {
      // this.firestore.collection('raised-hands').doc(event_id).set({raisedHands: callData});
    }
  }
}
