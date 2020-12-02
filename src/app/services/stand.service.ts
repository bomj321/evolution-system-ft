import { Injectable, Output, EventEmitter, NgZone } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AuthenticationService } from "../services/authentication.service";
import { BehaviorSubject, Observable, Observer } from 'rxjs';

const headers = new HttpHeaders().set(
  "X-Token",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJqaXJrYS1wdWJsaWMiLCJuYW1lIjoiQXV0aG9yaXphdGlvbiIsImlhdCI6MTUxNjIzOTAyMn0.pDU-3E-XTKHvtboiUZJ4qE5YLo9w5eZbTOn6-YXjJcI"
);

@Injectable({
  providedIn: 'root',
})
export class StandService {

  @Output() products = new EventEmitter
  @Output() slug = new EventEmitter<any>()
  private serverStreaming: string = environment.API_BASE_STREAMING;
  private serverSchedule: string = environment.API_SCHEDULE;
  private serverStands: string = environment.API_STANDS;
  private serverSocket: string = environment.API_BASE_SOCKET_API;
  private serverReactive: string = environment.API_SOCKET_API_REACTIVE;
  private eventSource: EventSource;

  private services = {
    admin: this.serverStands + "/api/v1/commercial-admins",
    scheduleGoogleDate: this.serverSchedule + "/api/v1/calendar",
    standCalendar: this.serverSchedule + "/api/v1/stand-calendars",
    googleDate: this.serverSchedule + "/api/v1/login/google",
    users: this.serverStands + "/api/v1/users",
    usersStand: this.serverStands + "/api/v1/stands-users",
    advisors: this.serverStands + "/api/v1/advisers",
    commercial: this.serverStands + "/api/v1/commercial",
    schedule: this.serverStands + "/api/v1/conference-schedules",
    schedulePublic: this.serverStands + "/public/api/v1/commercial/conference-schedules",
    events: this.serverStands + "/api/v1/events",
    commercialPublic: this.serverStands + "/public/api/v1/commercial",
    pavilions: this.serverStands + "/api/v1/pavilions",
    elementsPavilions: this.serverStands + "/api/v1/media-pavilions",
    groups: this.serverStands + "/api/v1/groups",
    models: this.serverStands + "/api/v1/models",
    sections: this.serverStands + "/api/v1/sections",
    stands: this.serverStands + "/api/v1/stands",
    standsSearcher: this.serverStands + "/api/v1/stands/searcher",
    branches: this.serverStands + "/api/v1/branches",
    products: this.serverStands + "/api/v1/products",
    coupons: this.serverStands + "/api/v1/coupons",
    elements: this.serverStands + "/api/v1/media-elements",
    downloads: this.serverStands + "/api/v1/downloads",
    chatMessages: this.serverStands + "/api/v1/chat-message",
    galleries: this.serverStands + "/api/v1/galleries",
    commercialScenes: this.serverStands + "/api/v1/commercial-scenes",
    scenesImages: this.serverStands + "/api/v1/scene-images",
    brochureImage: this.serverStands + "/api/v1/stands/upload/brochure",
    deleteStandImages: this.serverStands + "/api/v1/scene-images",
    requestElements: this.serverStands + "/api/v1/companies",
    countries: this.serverStands + "/api/v1/countries",
    countriesPublic: this.serverStands + "/public/api/v1/countries",
    webinarFair: this.serverStands + "/api/v1/webinars",
    contact: this.serverStands + "/api/v1/stand-contacts",
    publicHashtag: this.serverStands + "/public/api/v1/commercial/hashtag",
    uploadExcelPreregistration: this.serverStands + "/api/v1/preregistration",
    eventInscription: this.serverStands + "/api/v1/event-inscriptions",
    commercialSocket: this.serverSocket + "/room",
    serverReactive: this.serverReactive + "/stand/reactive/updates"
  };


  private servicesStreaming = {
    streamingInformation: this.serverStreaming + "/api/v1/conference-schedule/conference-hall",
    streamingInformationHall: this.serverStreaming + "/api/v1/transmission-handler/running/hall",
    streamingInformationConference: this.serverStreaming + "/api/v1/transmission-handler/running/commercial",
    streamingPlay: this.serverStreaming + "/api/v1/transmission-handler/play",
    streamingStop: this.serverStreaming + "/api/v1/transmission-handler/stop"
  };

  public httpOptions = {
    headers: new HttpHeaders({
      Authorization: `Bearer ${this.authenticationService.getToken()}`
    })
  };

  public httpOptionsBlob = {
    observe: 'response' as 'body',
    responseType: 'blob' as 'blob'
  };


  constructor(
    private http: HttpClient,
    private zone: NgZone,
    public authenticationService: AuthenticationService
  ) { }

  connectProducts(products) {
    this.products.emit(products)
  }



  public setFairSlug(slug) {
    this.slug.emit(slug)
  }



  /*********************SCHEDULE****************************** */


  getSchedules(conferenceUuidKey) {
    return this.http.get(this.services.schedulePublic + '/' + conferenceUuidKey, { headers: headers });
  }

  getSchedule(conferenceUuidKey) {
    return this.http.get(this.services.schedule + '/' + conferenceUuidKey);
  }

  /*********************SCHEDULE****************************** */


  getCountries() {
    return this.http.get(this.services.countries + '?pageParam=250');
  }
  getPublicCountries() {
    return this.http.get(this.services.countriesPublic + '?pageParam=250');
  }

  getUsers(params: HttpParams) {
    return this.http.get(this.services.users + '?' + params.toString());
  }

  saveUser(data) {
    return this.http.post(this.services.users, data);
  }

  /*********************ADMINS****************************** */

  getAdmins(uuidKey) {
    return this.http.get(this.services.admin + '/' + uuidKey);
  }

  getAdmin(uuidKey) {
    return this.http.get(this.services.admin + '/' + uuidKey);
  }

  saveAdmin(data, uuidKey) {
    return this.http.post(this.services.admin + '/' + uuidKey, data);
  }

  deleteAdmin(uuidKey, id) {
    return this.http.delete(this.services.admin + '/' + uuidKey + '/by-user/' + id);
  }

  editAdmin(data, id) {
    return this.http.put(this.services.admin + '/by-user/' + id, data);
  }




  /*********************SCHEDULE****************************** */

  /**********APIS FROM GOOGLE******** */


  getShedulesGoogleDate() {
    return this.http.get(this.services.googleDate);
  }
  saveScheduleGoogleDate(data) {
    return this.http.post(this.services.scheduleGoogleDate, data);
  }

  /**********NORMAL APIs******** */

  getStandCalendar(params: HttpParams) {
    return this.http.get(this.services.standCalendar + '?' + params.toString());
  }

  saveStandCalendar(data) {
    return this.http.post(this.services.standCalendar, data);
  }

  deleteSchedule(uuidKey) {
    return this.http.delete(this.services.standCalendar + '/' + uuidKey);
  }

  getContactInformation(uuidKey) {
    return this.http.get(this.services.standCalendar + '/' + uuidKey);
  }


  /*********************FAIRS****************************** */

  getCommercials(params: HttpParams) {
    return this.http.get(this.services.commercial + '?' + params.toString()); /**this.httpOptions */
  }

  getCommercial(uuidKey) {
    return this.http.get(this.services.commercial + '/' + uuidKey);
  }

  getCommercialImagePoster(uuidKey) {
    return this.http.get(this.services.commercial + '/download/poster/' + uuidKey, this.httpOptionsBlob);
  }

  getCommercialImageLogo(uuidKey) {
    return this.http.get(this.services.commercial + '/download/logo/' + uuidKey, this.httpOptionsBlob);
  }

  getCommercialImage(uuidKey) {
    return this.http.get(this.services.commercial + '/download/image/' + uuidKey, this.httpOptionsBlob);
  }

  getCommercialNextPavilion(keyCommercial, keyPavilion) {
    return this.http.get(this.services.commercialPublic + '/' + keyCommercial + '/pavilions/' + keyPavilion + '/next', { headers: headers });
  }

  saveCommercial(data) {
    return this.http.post(this.services.commercial, data);
  }

  updateImageCommercialPoster(data, uuidKey) {
    return this.http.put(this.services.commercial + '/upload/poster/' + uuidKey, data);
  }

  updateImageCommercialLogo(data, uuidKey) {
    return this.http.put(this.services.commercial + '/upload/logo/' + uuidKey, data);
  }

  updateImageCommercial(data, uuidKey) {
    return this.http.put(this.services.commercial + '/upload/image/' + uuidKey, data);
  }

  deleteCommercial(uuidKey) {
    return this.http.delete(this.services.commercial + '/' + uuidKey);
  }

  editCommercial(data, id) {
    return this.http.put(this.services.commercial + '/' + id, data);
  }


  /******************EVENTS*************** */

  getEvents(params: HttpParams) {
    return this.http.get(this.services.events + '?' + params.toString());
  }

  /*********************PAVILIONS****************************** */

  getPavilions(params: HttpParams) {
    return this.http.get(this.services.pavilions + '?' + params.toString());
  }

  getPavilion(uuidKey) {
    return this.http.get(this.services.pavilions + '/' + uuidKey);
  }

  savePavilion(data) {
    return this.http.post(this.services.pavilions, data);
  }

  getPavilionImage(uuidKey) {
    return this.http.get(this.services.pavilions + '/download/image/' + uuidKey, this.httpOptionsBlob);
  }

  updateImagePavilions(data, uuidKey) {
    return this.http.put(this.services.pavilions + '/upload/image/' + uuidKey, data);
  }

  deletePavilion(uuidKey) {
    return this.http.delete(this.services.pavilions + '/' + uuidKey);
  }

  editPavilion(data, id) {
    return this.http.put(this.services.pavilions + '/' + id, data);
  }

  orderPavilions(data) {
    return this.http.post(this.services.pavilions + '/orders', data);
  }

  updateFairPavilion(data, code, pavilionUuidkey) {
    return this.http.put(this.services.elementsPavilions + '/' + pavilionUuidkey + '/by-code/' + code, data);
  }

  updateImageFairPavilion(data, code, pavilionUuidkey) {
    return this.http.put(this.services.elementsPavilions + '/' + pavilionUuidkey + '/upload/' + code, data);
  }

  getPavilionImagePiece(code, pavilionUuidkey) {
    return this.http.get(this.services.elementsPavilions + '/' + pavilionUuidkey + '/download/' + code, this.httpOptionsBlob);
  }


  /*********************GRUPOS****************************** */

  getGroups(params: HttpParams) {
    return this.http.get(this.services.groups + '?' + params.toString());
  }

  getGroup(uuidKey) {
    return this.http.get(this.services.groups + '/' + uuidKey);
  }

  saveGroup(data) {
    return this.http.post(this.services.groups, data);
  }

  editGroup(data, id) {
    return this.http.put(this.services.groups + '/' + id, data);
  }

  deleteGroup(uuidKey) {
    return this.http.delete(this.services.groups + '/' + uuidKey);
  }

  getGroupImage(uuidKey) {
    return this.http.get(this.services.groups + '/download/image/' + uuidKey, this.httpOptionsBlob);
  }

  updateImageGroup(data, uuidKey) {
    return this.http.put(this.services.groups + '/upload/image/' + uuidKey, data);
  }

  getGroupPoster(uuidKey) {
    return this.http.get(this.services.groups + '/download/poster/' + uuidKey, this.httpOptionsBlob);
  }

  updateImagePoster(data, uuidKey) {
    return this.http.put(this.services.groups + '/upload/poster/' + uuidKey, data);
  }

  orderGroups(data) {
    return this.http.post(this.services.groups + '/orders', data);
  }

  /*********************MODELS****************************** */

  getModels(params: HttpParams) {
    return this.http.get(this.services.models + '?' + params.toString());
  }

  getModel(uuidKey) {
    return this.http.get(this.services.models + '/' + uuidKey);
  }

  saveModel(data) {
    return this.http.post(this.services.models, data);
  }

  deleteModel(uuidKey) {
    return this.http.delete(this.services.models + '/' + uuidKey);
  }

  editModel(data, id) {
    return this.http.put(this.services.models + '/' + id, data);
  }



  /*********************SECTIONS****************************** */

  getSections(params: HttpParams) {
    return this.http.get(this.services.sections + '?' + params.toString());
  }

  getSectionImage(uuidKey) {
    return this.http.get(this.services.sections + '/download/image/' + uuidKey, this.httpOptionsBlob);
  }

  saveSection(data) {
    return this.http.post(this.services.sections, data);
  }

  updateImageSection(data, uuidKey) {
    return this.http.put(this.services.sections + '/upload/image/' + uuidKey, data);
  }

  deleteSection(uuidKey) {
    return this.http.delete(this.services.sections + '/' + uuidKey);
  }

  editSection(data, id) {
    return this.http.put(this.services.sections + '/' + id, data);
  }


  /*********************STANDS****************************** */

  getStands(params: HttpParams) {
    return this.http.get(this.services.stands + '?' + params.toString());
  }


  getStandsSearcher(params: HttpParams) {
    return this.http.get(this.services.standsSearcher + '?' + params.toString());
  }


  getStand(uuidKey) {
    return this.http.get(this.services.stands + '/' + uuidKey);
  }


  getStandImage(uuidKey) {
    return this.http.get(this.services.stands + '/download/image/' + uuidKey, this.httpOptionsBlob);
  }

  updateImageStand(data, uuidKey) {
    return this.http.put(this.services.stands + '/upload/image/' + uuidKey, data);
  }

  saveStand(data) {
    return this.http.post(this.services.stands, data);
  }

  deleteStand(uuidKey) {
    return this.http.delete(this.services.stands + '/' + uuidKey);
  }

  editStand(data, id) {
    return this.http.put(this.services.stands + '/' + id, data);
  }


  getMediaElements(uuidKey) {
    return this.http.get(this.services.elements + '/' + uuidKey);
  }

  updateStandPieces(data, code, uuidKey) {
    return this.http.put(this.services.elements + '/' + uuidKey + '/by-code/' + code, data);
  }

  updateImageStandPieces(data, code, uuidKey) {
    return this.http.put(this.services.elements + '/' + uuidKey + '/upload/' + code, data);
  }

  deleteImageStandPieces(code, uuidKey) {
    return this.http.delete(this.services.elements + '/' + uuidKey + '/clear/' + code);
  }

  orderStands(data) {
    return this.http.post(this.services.stands + '/orders', data);
  }

  /*********************SUBSIDIARY****************************** */

  getSubsidiaries(params: HttpParams) {
    return this.http.get(this.services.branches + '?' + params.toString());
  }

  getSubsidiary(uuidKey) {
    return this.http.get(this.services.branches + '/' + uuidKey);
  }

  saveSubsidiary(data) {
    return this.http.post(this.services.branches, data);
  }

  deleteSubsidiary(uuidKey) {
    return this.http.delete(this.services.branches + '/' + uuidKey);
  }

  editSubsidiary(data, id) {
    return this.http.put(this.services.branches + '/' + id, data);
  }


  /*********************PRODUCTS****************************** */

  getProducts(params: HttpParams) {
    return this.http.get(this.services.products + '?' + params.toString());
  }

  getProduct(uuidKey) {
    return this.http.get(this.services.products + '/' + uuidKey);
  }


  getProductImage(uuidKey) {
    return this.http.get(this.services.products + '/download/image/' + uuidKey, this.httpOptionsBlob);
  }

  updateImageProduct(data, uuidKey) {
    return this.http.put(this.services.products + '/upload/image/' + uuidKey, data);
  }

  saveProduct(data) {
    return this.http.post(this.services.products, data);
  }

  deleteProduct(uuidKey) {
    return this.http.delete(this.services.products + '/' + uuidKey);
  }

  editProduct(data, id) {
    return this.http.put(this.services.products + '/' + id, data);
  }

  orderProduct(data) {
    return this.http.post(this.services.products + '/orders', data);
  }


  /*********************COUPONS****************************** */

  getCoupons(standUuidKey) {
    return this.http.get(this.services.coupons + '/' + standUuidKey);
  }

  getCoupon(standUuidKey, uuidKey) {
    return this.http.get(this.services.coupons + '/' + standUuidKey + '/by-coupon/' + uuidKey);
  }

  saveCoupon(data, standUuidKey) {
    return this.http.post(this.services.coupons + '/' + standUuidKey, data);
  }

  deleteCoupon(standUuidKey, codeuuidKey) {
    return this.http.delete(this.services.coupons + '/' + standUuidKey + '/by-coupon/' + codeuuidKey);
  }

  editCoupon(data, standUuidKey, codeuuidKey) {
    return this.http.put(this.services.coupons + '/' + standUuidKey + '/by-coupon/' + codeuuidKey, data);
  }

  getCouponImage(standUuidKey, uuidKey) {
    return this.http.get(this.services.coupons + '/' + standUuidKey + '/download/' + uuidKey, this.httpOptionsBlob);
  }

  updateImageCoupon(data, standUuidKey, uuidKey) {
    return this.http.put(this.services.coupons + '/' + standUuidKey + '/upload/' + uuidKey, data);
  }

  deleteImageCoupon(standUuidKey, codeuuidKey) {
    return this.http.delete(this.services.coupons + '/' + standUuidKey + '/clear/' + codeuuidKey);
  }


  /*********************DOWNLOADS****************************** */

  getDownloads(standUuidKey) {
    return this.http.get(this.services.downloads + '/' + standUuidKey);
  }

  saveDownload(data, standUuidKey) {
    return this.http.post(this.services.downloads + '/' + standUuidKey, data);
  }

  deleteDownload(standUuidKey, downloaduuidKey) {
    return this.http.delete(this.services.downloads + '/' + standUuidKey + '/by-download/' + downloaduuidKey);
  }

  editDownload(data, standUuidKey, downloaduuidKey) {
    return this.http.put(this.services.downloads + '/' + standUuidKey + '/by-download/' + downloaduuidKey, data);
  }

  getDownloadFile(uuidKey, downloaduuidKey) {
    return this.http.get(this.services.downloads + '/download/' + uuidKey + '/' + downloaduuidKey, this.httpOptionsBlob);
  }

  updateFileDownload(data, uuidKey, downloaduuidKey) {
    return this.http.put(this.services.downloads + '/upload/' + uuidKey + '/' + downloaduuidKey, data);
  }


  /******************MESSAGES*************** */



  getChatMessages(standUuidKey) {
    return this.http.get(this.services.chatMessages + '/' + standUuidKey);
  }

  saveChatMessage(data, standUuidKey) {
    return this.http.post(this.services.chatMessages + '/' + standUuidKey, data);
  }

  deleteChatMessage(standUuidKey, messageuuidKey) {
    return this.http.delete(this.services.chatMessages + '/' + standUuidKey + '/by-message/' + messageuuidKey);
  }

  editChatMessage(data, standUuidKey, messageuuidKey) {
    return this.http.put(this.services.chatMessages + '/' + standUuidKey + '/by-message/' + messageuuidKey, data);
  }



  /*********************ADVISORS****************************** */

  getAdvisors(standUuidKey) {
    return this.http.get(this.services.advisors + '/' + standUuidKey);
  }

  saveAdvisor(data, standUuidKey) {
    return this.http.post(this.services.advisors + '/' + standUuidKey, data);
  }

  deleteAdvisor(standUuidKey, advisorsuuidKey) {
    return this.http.delete(this.services.advisors + '/' + standUuidKey + '/by-adviser/' + advisorsuuidKey);
  }

  editAdvisor(data, standUuidKey, advisorsuuidKey) {
    return this.http.put(this.services.advisors + '/' + standUuidKey + '/by-adviser/' + advisorsuuidKey, data);
  }

  getAdvisorImage(standUuidKey, advisorsuuidKey) {
    return this.http.get(this.services.advisors + '/' + standUuidKey + '/download/' + advisorsuuidKey, this.httpOptionsBlob);
  }

  updateImageAdvisor(data, standUuidKey, advisorsuuidKey) {
    return this.http.put(this.services.advisors + '/' + standUuidKey + '/upload/' + advisorsuuidKey, data);
  }

  deleteAdvisorimage(standUuidKey, advisorsuuidKey) {
    return this.http.delete(this.services.advisors + '/' + standUuidKey + '/clear/' + advisorsuuidKey);
  }

  /******************USERS*************** */

  getUsersStand(standUuidKey) {
    return this.http.get(this.services.usersStand + '/' + standUuidKey);
  }

  getUsersStandByUsers(useruuidKey) {
    return this.http.get(this.services.usersStand + '/by-user/' + useruuidKey);
  }

  saveUserStand(data, standUuidKey) {
    return this.http.post(this.services.usersStand + '/' + standUuidKey, data);
  }

  deleteUserStand(standUuidKey, useruuidKey) {
    return this.http.delete(this.services.usersStand + '/' + standUuidKey + '/by-user/' + useruuidKey);
  }

  editUserStand(data, standUuidKey, useruuidKey) {
    return this.http.put(this.services.usersStand + '/' + standUuidKey + '/by-user/' + useruuidKey, data);
  }




  /*********************GALLERIES****************************** */

  getGallery(standUuidKey) {
    return this.http.get(this.services.galleries + '/' + standUuidKey);
  }

  saveGallery(data, standUuidKey) {
    return this.http.post(this.services.galleries + '/' + standUuidKey, data);
  }

  deleteGallery(standUuidKey, galleryuuidKey) {
    return this.http.delete(this.services.galleries + '/' + standUuidKey + '/by-image/' + galleryuuidKey);
  }

  editGallery(data, standUuidKey, galleryuuidKey) {
    return this.http.put(this.services.galleries + '/' + standUuidKey + '/by-image/' + galleryuuidKey, data);
  }

  getGalleryFile(standUuidKey, galleryuuidKey) {
    return this.http.get(this.services.galleries + '/' + standUuidKey + '/download/' + galleryuuidKey, this.httpOptionsBlob);
  }

  updateFileGallery(data, standUuidKey, galleryuuidKey) {
    return this.http.put(this.services.galleries + '/' + standUuidKey + '/upload/' + galleryuuidKey, data);
  }


  /*************SCENES**************** */

  getCommercialScenes(params: HttpParams) {
    return this.http.get(this.services.commercialScenes + '?' + params.toString());
  }

  getCommercialScene(commercialUuidKey) {
    return this.http.get(this.services.scenesImages + '/' + commercialUuidKey);
  }

  getCommercialSceneByCode(commercialUuidKey, code) {
    return this.http.get(this.services.scenesImages + '/' + commercialUuidKey + '/by-code/' + code);
  }

  getMediaElementsFacade(commercialUuidKey) {
    return this.http.get(this.services.scenesImages + '/' + commercialUuidKey, { headers: headers });
  }

  updateImageScenesPieces(data, code, commercialUuidKey) {
    return this.http.put(this.services.scenesImages + '/' + commercialUuidKey + '/upload/' + code, data);
  }

  updateImageScenesPiecesInformation(data, code, commercialUuidKey) {
    return this.http.put(this.services.scenesImages + '/' + commercialUuidKey + '/by-code/' + code, data);
  }


  deleteImageScenesPieces(code, commercialUuidKey) {
    return this.http.delete(this.services.scenesImages + '/' + commercialUuidKey + '/clear/' + code);
  }


  /********************************FAIR WEBINAR****************** */


  getWebinars(params: HttpParams) {
    return this.http.get(this.services.webinarFair + '?' + params.toString()); /**this.httpOptions */
  }

  getWebinar(uuidKey) {
    return this.http.get(this.services.webinarFair + '/' + uuidKey);
  }

  saveWebinar(data) {
    return this.http.post(this.services.webinarFair, data);
  }

  editWebinar(data, uuidKey) {
    return this.http.put(this.services.webinarFair + '/' + uuidKey, data);
  }

  deleteWebinar(uuidKey) {
    return this.http.delete(this.services.webinarFair + '/' + uuidKey);
  }


  /**************PUBLIC SERVICES**************** */




  public getCommercialPublic(slug) {
    return this.http.get(this.services.publicHashtag + '/' + slug, { headers: headers });
  }


  public getStandsByPavilion(params) {
    return this.http.get(this.services.stands + '?' + params.toString());
  }


  /*********************BROCHURE************************** */

  updateFileBrochure(data, uuidKey) {
    return this.http.put(this.services.brochureImage + '/' + uuidKey, data);
  }



  /********************REQUESTS********************* */

  public getRequestCompanies(params) {
    return this.http.get(this.services.requestElements + '?' + params.toString());
  }


  /**************CONTACT*********************** */

  getContact(params) {
    return this.http.get(this.services.contact + '?' + params.toString());
  }




  saveContact(data) {
    return this.http.post(this.services.contact, data);
  }



  /**********************************STREAMING********************************* */
  getStreamingDate(params: HttpParams, uuidIdKeyHall) {
    return this.http.get(this.servicesStreaming.streamingInformation + '/' + uuidIdKeyHall + '?' + params.toString());
  }

  getStreamingDateHall(uuidIdKeyHall) {
    return this.http.get(this.servicesStreaming.streamingInformationHall + '/' + uuidIdKeyHall);
  }
  getStreamingConference(uuidIdKeyConference) {
    return this.http.get(this.servicesStreaming.streamingInformationConference + '/' + uuidIdKeyConference);
  }



  updatePlayTranmission(eventProgramId, data = {}) {
    return this.http.put(this.servicesStreaming.streamingPlay + '/' + eventProgramId, data);
  }

  updateStopTranmission(eventProgramId, data = {}) {
    return this.http.put(this.servicesStreaming.streamingStop + '/' + eventProgramId, data);
  }


  //return this.http.put(this.services.groups + '/upload/poster/' + uuidKey, data);



  /***********************NEW SECTION PRE REGISTRATION*************************** */

  getEventInscription(params: HttpParams) {
    return this.http.get(this.services.eventInscription + '?' + params.toString());
  }

  uploadDataExcel(data, commercialUuidkey) {
    return this.http.post(this.services.uploadExcelPreregistration + '/' + commercialUuidkey + '/upload', data);
  }



  /***********************COMMERCIAL SOCKET******************** */
  getCommercialSocket(room) {
    return this.http.get(this.services.commercialSocket + '/' + room);
  }

  /****************NEW REACTIVE SOCKET************* */
  public startUpdatesEventSource(standUuidkey, token): BehaviorSubject<any>{
    const eventsBSub: BehaviorSubject<any> = new BehaviorSubject<any>({});
    this.eventSource = new EventSource(this.services.serverReactive + '?standUuidKeys=' + standUuidkey + '&customToken=' + token);
    this.eventSource.onmessage = (event) => {
      this.zone.run(() => eventsBSub.next(event.data));
    };
    this.eventSource.onerror = err => eventsBSub.error(err);
    return eventsBSub;
  }


}
