const mongoose = require('mongoose');
const FR = require("../models/FR");
const fs = require('fs');
path = require('path')
const {
  drawImage,
  drawLinesOfText,
  drawRectangle,
  drawText,
  PDFArray,
  PDFContentStream,
  PDFDictionary,
  PDFDocument,
  PDFDocumentFactory,
  PDFDocumentWriter,
  PDFIndirectReference,
  PDFName,
  PDFNumber,
  PDFRawStream,
  PDFString,
} = require('pdf-lib');

var geneAmex = function (u,a,pd) {
    const getAcroFields = (pdfDoc) => {
        if (!pdfDoc.catalog.getMaybe('AcroForm')) return [];
        const acroForm = pdfDoc.index.lookup(pdfDoc.catalog.get('AcroForm'));
      
        if (!acroForm.getMaybe('Fields')) return [];
        const acroFields = pdfDoc.index.lookup(acroForm.get('Fields'));
      
        return acroFields.array.map(pdfDoc.index.lookup);
      };
      
      const findAcroFieldByName = (pdfDoc, name) => {
        const acroFields = getAcroFields(pdfDoc);
        return acroFields.find((acroField) => {
          const fieldName = acroField.getMaybe('T');
          return !!fieldName && fieldName.string === name;
        });
      };
      
      const logAcroFieldNames = (pdfDoc) => {
        const acroFields = getAcroFields(pdfDoc);
        acroFields.forEach((acroField) => {
          console.log(
            'Field Name:',
            acroField.get('T').toString(),
            'Field Type:',
            acroField.get('FT').toString()
          );
        });
      };
      
      const fillAcroTextField = (
        pdfDoc,
        acroField,
        fontObject,
        text,
        fontSize = 15,
      ) => {
        const fieldRect = acroField.get('Rect');
        const fieldWidth = fieldRect.get(2).number - fieldRect.get(0).number;
        const fieldHeight = fieldRect.get(3).number - fieldRect.get(1).number;
      
        const appearanceStream = pdfDoc.register(
          PDFContentStream.of(
            PDFDictionary.from({
              Type: PDFName.from('XObject'),
              Subtype: PDFName.from('Form'),
              BBox: PDFArray.fromArray([
                PDFNumber.fromNumber(0),
                PDFNumber.fromNumber(0),
                PDFNumber.fromNumber(fieldWidth),
                PDFNumber.fromNumber(fieldHeight),
              ], pdfDoc.index),
              Resources: PDFDictionary.from({
                Font: PDFDictionary.from({
                  FontObject: fontObject
                }, pdfDoc.index)
              }, pdfDoc.index),
            }, pdfDoc.index),
            drawLinesOfText(text.split('\n'), {
              x: 2,
              y: fieldHeight - 13,
              font: 'FontObject',
              size: fontSize,
              colorRgb: [0, 0, 0],
            })
          ),
        );
      
        acroField.set('V', PDFString.fromString(text));
        acroField.set('Ff', PDFNumber.fromNumber(1));
        acroField.set('AP', PDFDictionary.from({ N: appearanceStream }, pdfDoc.index));
      };
      
      const existingPdfBytes = fs.readFileSync(__dirname+'/PRI100.pdf')

      const pdfDoc = PDFDocumentFactory.load(existingPdfBytes);
      
      
      const [FontHelvetica] = pdfDoc.embedStandardFont('Helvetica');
      
      // Have to manually create this.
      // Field names can be found using `logAcroFieldNames(pdfDoc)`
      const fieldNames = {
        razon: 'Razon_Social',
        domicilio1: 'DomicilioLegal1',
      };
      
      
      const fillInField = (fieldName, text, fontSize) => {
        const field = findAcroFieldByName(pdfDoc, fieldName);
        if (!field) throw new Error(`Missing AcroField: ${fieldName}`);
        fillAcroTextField(pdfDoc, field, FontHelvetica, text, fontSize);
      };
      
      fillInField(fieldNames.razon, u+ '');
      fillInField(fieldNames.domicilio1, a+ '');
      
      
      
      
      
      const pdfBytes = PDFDocumentWriter.saveToBytes(pdfDoc);
      
      fs.writeFileSync('./PRI100 '+pd+'.pdf', pdfBytes);
      
      console.log('Filled-in Template Written To ./filled.pdf');
}

let frController = {};

frController.genAmex = function (req,res) {
    FR.findById(req.params.id).exec(function (err, fr) {       

geneAmex(fr.RAZON,fr.DOMICILIOLEGAL,fr.RAZON)
console.log(__dirname);

res.download(path.join(__dirname,'../PRI100 '+fr.RAZON+'.pdf'), function (err) {

});

});
      

}

frController.list = function(req, res){
    
    FR.find({USUARIO: req.user.id}).exec(function(err, fr){
        if( err ){ console.log('Error: ', err); return; }
        console.log("The INDEX");
        res.render('../views/fr/index', {fr: fr} );
        
    });
    
};


frController.show = function(req, res){
    FR.findOne({_id: req.params.id}).exec(function(err, fr){
        if( err ){ console.log('Error: ', err); return; }
        
        res.render('../views/fr/show', {fr: fr} );
    });
    
};



frController.create = function(req, res){
    res.render('../views/fr/create');
};

frController.save = function(req, res){
    var fr = new FR( req.body );
    fr.USUARIO = req.user.id;
    fr.save(function(err){
        if( err ){ console.log('Error: ', err); return; }
        
        console.log("Successfully created a product. :)");
        res.redirect("/fr/show/"+fr._id);
        
    });
};

frController.edit = function(req, res) {
    FR.findOne({_id: req.params.id}).exec(function (err, fr) {
      if (err) { console.log("Error:", err); return; }
      
      res.render("../views/fr/edit", {fr: fr});
      
    });
  };
  
  frController.update = function(req, res){
      FR.findByIdAndUpdate( req.params.id, {$set: {
          Nombre: req.body.Nombre,
          DNI: req.body.DNI
      }}, { new: true },
      function( err, fr){
          if( err ){ 
              console.log('Error: ', err); 
              res.render('../views/fr/edit', {fr: req.body} );
          }
          
          console.log( fr );
          
          res.redirect('/fr/show/' + fr._id);
          
      });
  };
  frController.delete = function(req, res){
    
    FR.remove({_id: req.params.id}, function(err){
        if( err ){ console.log('Error: ', err); return; }
        
        console.log("Product deleted!");
        res.redirect("/fr");
    });
    
};

/*
 * Other actions
 */

module.exports = frController;