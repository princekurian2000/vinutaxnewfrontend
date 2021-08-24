import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {ApiService} from '../api.service'
import { SharedService } from '../shared.service';
@Component({
  selector: 'app-display-all-customer-invoice',
  templateUrl: './display-all-customer-invoice.component.html',
  styleUrls: ['./display-all-customer-invoice.component.css']
})
export class DisplayAllCustomerInvoiceComponent implements OnInit {
  customerinvoices = []; 
  customerdrftinvoices=[];
  whose=localStorage.getItem("uEmail"); 

  displaycustomerorsupplier="";
  invoicebuttonname="";

  constructor(private router:Router,private api:ApiService,private sharedapi:SharedService) {
    if(localStorage.getItem("loggedIn")!="true"){
      this.router.navigate(['']);
    }
    if(this.sharedapi.getCustomerOrSupplier()=="Customer"){
      this.displaycustomerorsupplier="Customer";
      this.invoicebuttonname="New Customer Invoice";
      this.api.getAllCustomerInvoioce(this.whose).subscribe((data:any)=>{
        //console.log(data);    
        data.forEach(element => {
          this.api.getCustomerNameFromId(element.customerid).subscribe((nameobj:any)=>{
            this.customerinvoices.push({"customerid":element.customerid,"id":element._id,"invoiceid":element.invoiceid,"reference":element.reference,"customername":nameobj.name,"date":element.date,"duedate":element.duedate,"totalamount":element.totalamount,"status":"approved"});
          });        
        });
      }); 
      this.api.getAllCustomerDraftInvoioce(this.whose).subscribe((data:any)=>{
        //console.log(data);    
        data.forEach(element => {
          this.api.getCustomerNameFromId(element.customerid).subscribe((nameobj:any)=>{
            this.customerinvoices.push({"customerid":element.customerid,"id":element._id,"invoiceid":element.invoiceid,"reference":element.reference,"customername":nameobj.name,"date":element.date,"duedate":element.duedate,"totalamount":element.totalamount,"status":"draft"});
          });        
        });
      }); 
    }
    else if(this.sharedapi.getCustomerOrSupplier()=="Supplier"){
      this.displaycustomerorsupplier="Supplier";
      this.invoicebuttonname="New Supplier Invoice";
      this.api.getAllSupplierInvoioce(this.whose).subscribe((data:any)=>{
        //console.log(data);    
        data.forEach(element => {
          this.api.getSupplierNameFromId(element.customerid).subscribe((nameobj:any)=>{
            this.customerinvoices.push({"customerid":element.customerid,"id":element._id,"invoiceid":element.invoiceid,"reference":element.reference,"customername":nameobj.name,"date":element.date,"duedate":element.duedate,"totalamount":element.totalamount,"status":"approved"});
          });        
        });
      }); 
      this.api.getAllSupplierDraftInvoioce(this.whose).subscribe((data:any)=>{
        //console.log(data);    
        data.forEach(element => {
          this.api.getSupplierNameFromId(element.customerid).subscribe((nameobj:any)=>{
            this.customerinvoices.push({"customerid":element.customerid,"id":element._id,"invoiceid":element.invoiceid,"reference":element.reference,"customername":nameobj.name,"date":element.date,"duedate":element.duedate,"totalamount":element.totalamount,"status":"draft"});
          });        
        });
      }); 
    }
    else{
      this.displaycustomerorsupplier="NONE";
      this.invoicebuttonname="NONE"
    }
     
   }

  ngOnInit(): void {
  }
  displayNewinvoice(){
    this.router.navigate(['\customerinvoice']);
  }
  editordelete(i,status){
   // window.alert(status)
    this.sharedapi.setidforcustomeredit(i,status);
    //this.router.navigate(['\editcustomerinvoice']);
     this.router.navigate(['\intermediatedisplay']);    
  }
  customerclicked(i){   
    this.sharedapi.setSelectedCustomerID(i);
  }
  setasCustomer(){   
    this.sharedapi.setCustomerOrSupplier("Customer");
    this.displaycustomerorsupplier="Customer";
    this.invoicebuttonname="New Customer Invoice"
    this.api.getAllCustomerInvoioce(this.whose).subscribe((data:any)=>{
      //console.log(data);    
      data.forEach(element => {
        this.api.getCustomerNameFromId(element.customerid).subscribe((nameobj:any)=>{
          this.customerinvoices.push({"customerid":element.customerid,"id":element._id,"invoiceid":element.invoiceid,"reference":element.reference,"customername":nameobj.name,"date":element.date,"duedate":element.duedate,"totalamount":element.totalamount,"status":"approved"});
        });        
      });
    }); 
    this.api.getAllCustomerDraftInvoioce(this.whose).subscribe((data:any)=>{
      //console.log(data);    
      data.forEach(element => {
        this.api.getCustomerNameFromId(element.customerid).subscribe((nameobj:any)=>{
          this.customerinvoices.push({"customerid":element.customerid,"id":element._id,"invoiceid":element.invoiceid,"reference":element.reference,"customername":nameobj.name,"date":element.date,"duedate":element.duedate,"totalamount":element.totalamount,"status":"draft"});
        });        
      });
    }); 
  }
  setasSupplier(){   
    this.sharedapi.setCustomerOrSupplier("Supplier");
    this.displaycustomerorsupplier="Supplier";
    this.invoicebuttonname="New Supplier Invoice";
    this.api.getAllSupplierInvoioce(this.whose).subscribe((data:any)=>{
      //console.log(data);    
      data.forEach(element => {
        this.api.getSupplierNameFromId(element.customerid).subscribe((nameobj:any)=>{
          this.customerinvoices.push({"customerid":element.customerid,"id":element._id,"invoiceid":element.invoiceid,"reference":element.reference,"customername":nameobj.name,"date":element.date,"duedate":element.duedate,"totalamount":element.totalamount,"status":"approved"});
        });        
      });
    }); 
    this.api.getAllSupplierDraftInvoioce(this.whose).subscribe((data:any)=>{
      //console.log(data);    
      data.forEach(element => {
        this.api.getSupplierNameFromId(element.customerid).subscribe((nameobj:any)=>{
          this.customerinvoices.push({"customerid":element.customerid,"id":element._id,"invoiceid":element.invoiceid,"reference":element.reference,"customername":nameobj.name,"date":element.date,"duedate":element.duedate,"totalamount":element.totalamount,"status":"draft"});
        });        
      });
    }); 
  }
}
