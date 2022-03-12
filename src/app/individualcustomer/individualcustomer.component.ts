import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import {Router} from '@angular/router';
import {SharedService} from '../shared.service';

@Component({
  selector: 'app-individualcustomer',
  templateUrl: './individualcustomer.component.html',
  styleUrls: ['./individualcustomer.component.css']
})
export class IndividualcustomerComponent implements OnInit {
  totalmamount=0;
  showinvoice=true;
  editing=false;
  noediting=true;
   customerid="";
   userFullName ="";
   userEmailId ="";
   userContactNo="";
   userAddress="";
    customerinvoices = []; 
    customerdrftinvoices=[];
    displayincomes=[]
     whose=localStorage.getItem("uEmail"); 
     isOpen:boolean;
     matchactive=[];
     selectedmatchingcategory=[];
     displaycategorynames=[];
     categorynamefront=[];
     addnewcategoryenable=[];
     displaycustomerorsupplier="NONE";
     viewuserdetails="NONE"
  EnterValidData(){
   window.alert("Enter Valid Data");
  }
  constructor(private api:ApiService,private router:Router,private sharedservice:SharedService) { 
    // var id=this.sharedservice.getidforcustomeredit();
    if(localStorage.getItem("loggedIn")!="true"){
      this.router.navigate(['']);
    }
    this.customerid=this.sharedservice.getSelectedCustomer();
   this.editing=false;
   this.noediting=true;
   if(this.sharedservice.getCustomerOrSupplier()=="Customer"){
    this.displaycustomerorsupplier="Customer"; 
    this.viewuserdetails="View Customer Details";
    this.api.getCustomerDetails(this.customerid).subscribe((data:any)=>{      
      this.userFullName=data[0].userFullName;
      this.userEmailId=data[0].userEmailId;
      this.userContactNo=data[0].userContactNo;
      this.userAddress=data[0].userAddress;      
    });  
    this.api.getAllInvoioceOfACustomer(this.whose,this.customerid).subscribe((data:any)=>{
      //console.log(data);    
      data.forEach(element => {
        this.api.getCustomerNameFromId(element.customerid).subscribe((nameobj:any)=>{
          this.totalmamount=this.totalmamount+Number(element.totalamount);
          this.customerinvoices.push({"customerid":element.customerid,"id":element._id,"invoiceid":element.invoiceid,"reference":element.reference,"customername":nameobj.name,"date":element.date,"duedate":element.duedate,"totalamount":element.totalamount,"status":"approved"});
        });        
      });
    }); 
    this.api.getAllInvoioceOfACustomerDraft(this.whose,this.customerid).subscribe((data:any)=>{
      //console.log(data);    
      data.forEach(element => {
        this.totalmamount=this.totalmamount+Number(element.totalamount);
        this.api.getCustomerNameFromId(element.customerid).subscribe((nameobj:any)=>{
          this.customerinvoices.push({"customerid":element.customerid,"id":element._id,"invoiceid":element.invoiceid,"reference":element.reference,"customername":nameobj.name,"date":element.date,"duedate":element.duedate,"totalamount":element.totalamount,"status":"draft"});
        });        
      });
    }); 

    }
   else if(this.sharedservice.getCustomerOrSupplier()=="Supplier"){
    this.displaycustomerorsupplier="Supplier"; 
    this.viewuserdetails="View Supplier Details";
    this.api.getSupplierDetails(this.customerid).subscribe((data:any)=>{      
      this.userFullName=data[0].userFullName;
      this.userEmailId=data[0].userEmailId;
      this.userContactNo=data[0].userContactNo;
      this.userAddress=data[0].userAddress;      
    });  
    this.api.getAllInvoioceOfASupplier(this.whose,this.customerid).subscribe((data:any)=>{
      //console.log(data);    
      data.forEach(element => {
        this.api.getSupplierNameFromId(element.customerid).subscribe((nameobj:any)=>{
          this.totalmamount=this.totalmamount+Number(element.totalamount);
          this.customerinvoices.push({"customerid":element.customerid,"id":element._id,"invoiceid":element.invoiceid,"reference":element.reference,"customername":nameobj.name,"date":element.date,"duedate":element.duedate,"totalamount":element.totalamount,"status":"approved"});
        });        
      });
    }); 
    this.api.getAllInvoioceOfASupplierDraft(this.whose,this.customerid).subscribe((data:any)=>{
      //console.log(data);    
      data.forEach(element => {
        this.totalmamount=this.totalmamount+Number(element.totalamount);
        this.api.getSupplierNameFromId(element.customerid).subscribe((nameobj:any)=>{
          this.customerinvoices.push({"customerid":element.customerid,"id":element._id,"invoiceid":element.invoiceid,"reference":element.reference,"customername":nameobj.name,"date":element.date,"duedate":element.duedate,"totalamount":element.totalamount,"status":"draft"});
        });        
      });
    }); 

    }
    else{    
        this.displaycustomerorsupplier="NONE"; 
        this.router.navigate(['/report']);     
    }
    

   }

  ngOnInit(): void {
  }
  editordelete(i,status){
    // window.alert(status)
     this.sharedservice.setidforcustomeredit(i,status);
     //this.router.navigate(['\editcustomerinvoice']);
      this.router.navigate(['\intermediatedisplay']);     
   }
   customerclicked(i){   
     this.sharedservice.setSelectedCustomerID(i);
   }
  editInvoice(){   
        this.router.navigate(['\editcustomerinvoice']);  
  }
  enableEditing(){
    this.editing=true;
    this.noediting=false;
  }
  showInvoices(){
    this.showinvoice=true;
  }
  showAdvancePayment(){    
    this.displayincomes=[];
    this.api.getAllCashAccountsCustomer(this.userFullName,this.whose).subscribe((data:any)=>{
      //console.log(data);
      data.forEach(element => {
        this.displayincomes.push(element);
        this.matchactive.push(false);
        this.displaycategorynames.push(false);
        this.addnewcategoryenable.push(false);
        //console.log(element)
      });
    })
    this.showinvoice=false;
  }
  matchSelected(i){
    var p=0;
    for(p=0;p<this.matchactive.length;p++){
      if(p!=i){
        this.matchactive[p]=false;
      }
    }
    this.matchactive[i]=true;

  }
  createSelected(i){      
    this.matchactive[i]=false;
   }
  onPressKeyboardCategory(searchValue: string,j:number){     
    this.categorynamefront=[];
    var flag=false;
    this.displaycategorynames[j]=true;    
    this.addnewcategoryenable[j]=false;
    this.api.getCategories().subscribe( (data:any)=>{  
      var len=data.length; 
      var op=0;
      for(var o=0;o<len;o++){  
        this.categorynamefront.push({"titlecategory":data[op].titlecategory,"category":[]});
        for(var q=0;q<data[op].category.length;q++) {
          if((data[op].category[q].whose=="All")||(data[op].category[q].whose==this.whose)){
            if(data[op].category[q].category.toUpperCase().indexOf(searchValue.toUpperCase())!=-1){
              this.categorynamefront[o].category.push(data[op].category[q].category);           
              flag=true;           
            }
          }          
        }
        if(this.categorynamefront[o].category.length<=0){
            this.categorynamefront.splice(o,1);
              len--;  
              o--;
        }
        op++;
      }   
      if(flag==false){       
          this.addnewcategoryenable[j]=true;      
      } 
    });    
  }

  savePayment(i:number){
    // this.whose=localStorage.getItem("uEmail");
    // var amount=0;
    // if((!this.payments[i].paidin)&&(!this.payments[i].paidout)) {
    //   window.alert("Enter Amount");
    //   return;
    // }
    // if(!this.payments[i].category){
    //   window.alert("Enter Category");
    //   return;
    // }
    //  //update in income table
    //  this.api.createNextCashAccountNumber(this.email).subscribe((data:any)=>{
    //   this.payments[i].id=data.msg;

    //   if(this.payments[i].paidin){
    //     amount=this.payments[i].paidin;
    //     this.payments[i].amount=-1*this.payments[i].paidin;
    //     this.api.addCashAccount(this.email,this.payments[i]).subscribe((data:any)=>{
    //       if(data.msg=="Successfully Saved"){
    //         window.alert("Saved Successfully");
    //         this.router.navigate(['/report']);
    //       }
    //       else{
    //         window.alert("Please Try after some time");
    //       }  
    //     });
    //   }
    //   else if(this.payments[i].paidout){
    //     amount=-1*this.payments[i].paidout;
    //     this.payments[i].amount=this.payments[i].paidout;
    //     this.api.addCashAccount(this.email,this.payments[i]).subscribe((data:any)=>{
    //       if(data.msg=="Successfully Saved"){
    //         window.alert("Saved Successfully");
    //         this.router.navigate(['/report']);
    //       }
    //       else{
    //         window.alert("Please Try after some time");
    //       }  
    //     });
    //   }

    //     //adding to bankStatement
    //     this.api.addbankstatement(this.payments[i].date,amount,this.payments[i].description,this.email).subscribe((data:any)=>{
    //       window.alert("Saved Successfully");
    //      // this.removePayment(i);
    //     });
      
    //  });
    }

  deleteCustomer(){
    if(this.sharedservice.getCustomerOrSupplier()=="Customer"){
      this.api.deleteCustomer(this.customerid).subscribe((data:any)=>{
        window.alert(data.msg);      
        this.isOpen=false;
        this.router.navigate(['\displaycustomerinvoices']); 
      }); 
    }
     else if(this.sharedservice.getCustomerOrSupplier()=="Supplier"){
      this.api.deleteSupplier(this.customerid).subscribe((data:any)=>{
        window.alert(data.msg);      
        this.isOpen=false;
        this.router.navigate(['\displaycustomerinvoices']); 
      }); 
    }
    else{    
          this.displaycustomerorsupplier="NONE"; 
          this.router.navigate(['/report']);     
    }
  }
  updateCustomer(){
    if(this.sharedservice.getCustomerOrSupplier()=="Customer"){
      this.api.updateCustomer(this.customerid,this.userFullName,this.userEmailId,this.userContactNo,this.userAddress).subscribe((data:any)=>{
        window.alert(data.msg);      
        this.isOpen=false;
        this.router.navigate(['\displaycustomerinvoices']); 
      }); 
    }
     else if(this.sharedservice.getCustomerOrSupplier()=="Supplier"){
      this.api.updateSupplier(this.customerid,this.userFullName,this.userEmailId,this.userContactNo,this.userAddress).subscribe((data:any)=>{
        window.alert(data.msg);      
        this.isOpen=false;
        this.router.navigate(['\displaycustomerinvoices']); 
      }); 
    }
    else{    
          this.displaycustomerorsupplier="NONE"; 
          this.router.navigate(['/report']);     
    }
      
  }
  // deleteInvoice(){  
  //   var id=this.sharedservice.getidforcustomeredit();
  //   if(this.status=="approved"){
  //     this.api.deleteCustomerInvoice(id).subscribe((data:any)=>{
  //       window.alert(data.msg);
  //       this.router.navigate(['/displaycustomerinvoices']);          
  //     });
      
  //   }
  //   else if(this.status=="draft") {
  //     this.api.deleteCustomerInvoiceFromDraft(id).subscribe((data:any)=>{
  //       window.alert(data.msg);
  //       this.router.navigate(['/displaycustomerinvoices']);          
  //     });
  //   }
   
  // }
  setasCustomer(){   
    this.sharedservice.setCustomerOrSupplier("Customer");
  }
  setasSupplier(){   
    this.sharedservice.setCustomerOrSupplier("Supplier");
  }

}
