import { Component, OnInit } from '@angular/core';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { ApiService } from '../api.service';
import {Router} from '@angular/router';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

class Product{
  name: string;
  price: number;
  qty: number;
}
class Invoice{
  customerName: string;
  address: string;
  contactNo: number;
  email: string;
  date:string;
  duedate:string;
  invoiceno:string;
  referenceno:string;
  products: Product[] = [];
  additionalDetails: string;  

  constructor(){
    // Initially one empty product row we will show 
    this.products.push(new Product());
  }
}

@Component({
  selector: 'app-customer-invoice',
  templateUrl: './customer-invoice.component.html',
  styleUrls: ['./customer-invoice.component.css']
})
export class CustomerInvoiceComponent implements OnInit {
  invoice = new Invoice(); 
  names=[];
  i=0;
  generatePDF(action = 'open') {
    let docDefinition = {
      content: [
        {
          text: 'ELECTRONIC SHOP',
          fontSize: 16,
          alignment: 'center',
          color: '#047886'
        },
        {
          text: 'INVOICE',
          fontSize: 20,
          bold: true,
          alignment: 'center',
          decoration: 'underline',
          color: 'skyblue'
        },
        {
          text: 'Customer Details',
          style: 'sectionHeader'
        },
        {
          columns: [
            [
              {
                text: this.invoice.customerName,
                bold:true
              },
              { text: this.invoice.address },
              { text: this.invoice.email },
              { text: this.invoice.contactNo }
            ],
            [
              {
                text: `Date: ${new Date().toLocaleString()}`,
                alignment: 'right'
              },
              { 
                text: `Bill No : ${((Math.random() *1000).toFixed(0))}`,
                alignment: 'right'
              }
            ]
          ]
        },
        {
          text: 'Order Details',
          style: 'sectionHeader'
        },
        {
          table: {
            headerRows: 1,
            widths: ['*', 'auto', 'auto', 'auto'],
            body: [
              ['Product', 'Price', 'Quantity', 'Amount'],
              ...this.invoice.products.map(p => ([p.name, p.price, p.qty, (p.price*p.qty).toFixed(2)])),
              [{text: 'Total Amount', colSpan: 3}, {}, {}, this.invoice.products.reduce((sum, p)=> sum + (p.qty * p.price), 0).toFixed(2)]
            ]
          }
        },
        {
          text: 'Additional Details',
          style: 'sectionHeader'
        },
        {
            text: this.invoice.additionalDetails,
            margin: [0, 0 ,0, 15]          
        },
        {
          columns: [
            [{ qr: `${this.invoice.customerName}`, fit: '50' }],
            [{ text: 'Signature', alignment: 'right', italics: true}],
          ]
        },
        {
          text: 'Terms and Conditions',
          style: 'sectionHeader'
        },
        {
            ul: [
              'Order can be return in max 10 days.',
              'Warrenty of the product will be subject to the manufacturer terms and conditions.',
              'This is system generated invoice.',
            ],
        }
      ],
      styles: {
        sectionHeader: {
          bold: true,
          decoration: 'underline',
          fontSize: 14,
          margin: [0, 15,0, 15]          
        }
      }
    };

    if(action==='download'){
      pdfMake.createPdf(docDefinition).download();
    }else if(action === 'print'){
      pdfMake.createPdf(docDefinition).print();      
    }else{
      pdfMake.createPdf(docDefinition).open();      
    }

  }

  addProduct(){
    this.invoice.products.push(new Product());
  }
  EnterValidData(){
   window.alert("Enter Valid Data");
  }
  constructor(private api:ApiService,private router:Router) {
    var today = new Date().toISOString().split('T')[0];
    //window.alert(today);
    this.invoice.date=today
    //let latest_date =this.datepipe.transform(today, 'yyyy-MM-dd');
    var whose=localStorage.getItem("uEmail"); 
    this.api.createNextCustomerInvoiceNumber(whose).subscribe((data:any)=>{
      this.invoice.invoiceno=data.msg;
    });
    this.api.getAllCustomers(whose).subscribe((data:any)=>{
      data.forEach(element => {
        this.names.push(element);
      });
    });

   }

  ngOnInit(): void {
  }
  onCustomerSelection(e){
    let userFullName = e.target.value;
    let customer = this.names.filter(x => x.userFullName === userFullName)[0];
    console.log(customer);
    if(customer){
      this.invoice.address=customer.userAddress;
      this.invoice.contactNo=customer.userContactNo;
      this.invoice.email=customer.userEmailId;
    }
    else{
      this.invoice.address="";
      this.invoice.contactNo=Number("");
      this.invoice.email="";

    }
    

  }
  approveInvoice(){
    var whose=localStorage.getItem("uEmail");  
    var i: number,sum=0;
    this.api.addCustomerDetils(this.invoice.customerName,this.invoice.email,this.invoice.contactNo.toString(),this.invoice.address,whose).subscribe((data:any)=>{
      for(i=0;i<this.invoice.products.length;i++){
        sum+=this.invoice.products[i].price*this.invoice.products[i].qty;
      }    
      if(data.msg!="Database Error"){
        this.api.addCustomerInvoice(this.invoice.date,this.invoice.duedate,this.invoice.invoiceno,this.invoice.referenceno,this.invoice.products,sum,this.invoice.additionalDetails,whose,data.msg).subscribe((data:any)=>{
          window.alert(data.msg);
          this.router.navigate(['/report']);          
        });
      }
    });    
  }
  saveInvoiceonDraft(){
    var whose=localStorage.getItem("uEmail");  
    var i: number,sum=0;
    this.api.addCustomerDetils(this.invoice.customerName,this.invoice.email,this.invoice.contactNo.toString(),this.invoice.address,whose).subscribe((data:any)=>{
      for(i=0;i<this.invoice.products.length;i++){
        sum+=this.invoice.products[i].price*this.invoice.products[i].qty;
      }    
      if(data.msg!="Database Error"){
        this.api.addCustomerInvoiceDraft(this.invoice.date,this.invoice.duedate,this.invoice.invoiceno,this.invoice.referenceno,this.invoice.products,sum,this.invoice.additionalDetails,whose,data.msg).subscribe((data:any)=>{
          window.alert(data.msg);
          this.router.navigate(['/report']);          
        });
      }
    });

  }

}