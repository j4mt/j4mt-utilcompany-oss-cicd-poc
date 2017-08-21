<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form" %>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Up and running with Spring Framework quickly</title>

    <!-- Bootstrap -->
    <link href="/public/lib/bootstrap-3.1.1/css/bootstrap.min.css" rel="stylesheet">

    <!-- Our CSS -->
    <link href="/public/css/style.oss.css" rel="stylesheet">

</head>
<body class="faux-responsive ">

    <div class="m-header-2017" data-js-module="header2017">
        <div class="header-container">
            <div class="my-account"><a href="#"><i class="my-account-icon"><!-- my-account icon --></i></a></div>
            <div class="header">
                <ul class="change-user-type">
                    <li><a href="#" class="selected">At home</a></li>
                    <li><a href="#">For business</a></li>
                </ul>
                <div class="change-user-region">
                    <!-- Input Select Component -->
                    <div class="c-input-select -dark-bg -small -no-margin -no-padding -business -small-chevron"
                         data-js-component="inputSelect">
                        <!-- Hidden but exists for accessibility --><label for="header-country">Republic of Ireland</label>
                        <div class="select-input-container"><select name="name" id="header-country" tabindex="0"
                                                                    class="cs-select cs-skin-border" data-value-preset="">


                            <option
                                    data-region="" value="https://www.sseairtricity.com/ie/home" selected>Republic of
                                Ireland
                            </option>


                            <option
                                    data-region="" value="https://www.sseairtricity.com/uk/home">Northern Ireland
                                Electricity
                            </option>


                            <option
                                    data-region="" value="http://www.airtricitygasni.com/at-home/">Northern Ireland Gas
                            </option>


                        </select></div>
                    </div>
                    <!-- End Input Select Component -->
                </div>
                <a class="contact-us" href="#">Contact us</a> <a class="log-out" href="#">Log out</a></div>
            <div class="content"><a href="" class="logo"></a>
                <ul class="navigation">
                    <li class="nav-with-sub-menu"><a href="#" class="sub-menu-trigger">Products &amp; Services</a>
                        <ul class="sub-menu">
                            <li><a href="business-energy-small.html">Small Business (&euro;1-10k)</a></li>
                            <li><a href="business-energy-medium.html">Medium Business (&euro;10-200k)</a></li>
                            <li><a href="business-energy-large.html">Large Business (&euro;200k-unlimited)</a></li>
                        </ul>
                    </li>
                    <li><a href="#">News</a></li>
                    <li><a href="#">Help</a></li>
                    <li class="nav-with-sub-menu"><a href="#" class="sub-menu-trigger">About us</a>
                        <ul class="sub-menu">
                            <li><a href="business-energy-small.html">About us</a></li>
                            <li><a href="business-energy-medium.html">Energy tips</a></li>
                            <li><a href="business-energy-large.html">Energy sources</a></li>
                        </ul>
                    </li>
                    <li class="is-active"><a href="#" class="my-account-icon">My account</a></li>
                    <li><a href="#" class="search-icon" data-modal-target="search">Search</a></li>
                </ul>
            </div>
        </div>
    </div>

<%--<nav class="navbar navbar-default" role="navigation">--%>
<%--<div class="container-fluid">--%>
<%--<!-- Brand and toggle get grouped for better mobile display -->--%>
<%--<div class="navbar-header">--%>
<%--<button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">--%>
<%--<span class="sr-only">Toggle navigation</span>--%>
<%--<span class="icon-bar"></span>--%>
<%--<span class="icon-bar"></span>--%>
<%--<span class="icon-bar"></span>--%>
<%--</button>--%>
<%--<a class="navbar-brand" href="#">SSE Airtriciy</a>--%>
<%--</div>--%>
<%----%>
<%--<!-- Collect the nav links, forms, and other content for toggling -->--%>
<%--<div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">--%>
<%--<ul class="nav navbar-nav">--%>
<%--<li class="active"><a href="#">Submit Meter Reading</a></li>--%>
<%--<li class="dropdown">--%>
<%--<a href="#" class="dropdown-toggle" data-toggle="dropdown">Products<b class="caret"></b></a>--%>
<%--<ul class="dropdown-menu">--%>
<%--<li><a href="#">Electricity</a></li>--%>
<%--<li><a href="#">Gas</a></li>--%>
<%--<li><a href="#">Duel Fuel</a></li>--%>
<%--<li class="divider"></li>--%>
<%--<li><a href="#">Bunldes</a></li>--%>
<%--<li class="divider"></li>--%>
<%--<li><a href="#">Smart Home</a></li>--%>
<%--</ul>--%>
<%--</li>--%>
<%--</ul>--%>
<%--<form class="navbar-form navbar-left" role="search">--%>
<%--<div class="form-group">--%>
<%--<input type="text" class="form-control" placeholder="Search">--%>
<%--</div>--%>
<%--<button type="submit" class="btn btn-default">Submit</button>--%>
<%--</form>--%>
<%--<ul class="nav navbar-nav navbar-right">--%>
<%--<sec:authorize access="isAnonymous()">--%>
<%----%>
<%--<li><a href="<c:url value='/signup' />"><span class="glyphicon glyphicon-list-alt"></span> Sign up</a></li>--%>
<%--<li>--%>
<%--<a href="/login">Sign in <span class="glyphicon glyphicon-log-in"></span></a>--%>
<%--</li>--%>
<%--</sec:authorize>--%>
<%----%>
<%--<sec:authorize access="isAuthenticated()">--%>
<%--<li class="dropdown">--%>
<%--<a href="#" class="dropdown-toggle" data-toggle="dropdown">--%>
<%--<span class="glyphicon glyphicon-user"></span>--%>
<%--<sec:authentication property="principal.user.name" /> <b class="caret"></b>--%>
<%--</a>--%>
<%--<ul class="dropdown-menu">--%>
<%--<li><a href="/users/<sec:authentication property='principal.user.id' />"><span class="glyphicon glyphicon-user"></span> Profile</a></li>--%>
<%--<li>--%>
<%--<c:url var="logoutUrl" value="/logout" />--%>
<%--<form:form	id="logoutForm" action="${logoutUrl}" method="post">--%>
<%--</form:form>--%>
<%--<a href="#" onclick="document.getElementById('logoutForm').submit()"><span class="glyphicon glyphicon-log-out"></span> Sign out</a>--%>
<%--</li>--%>
<%--</ul>--%>
<%--</li>--%>
<%--</sec:authorize>--%>
<%--</ul>--%>
<%--</div><!-- /.navbar-collapse -->--%>
<%--</div><!-- /.container-fluid -->--%>
<%--</nav>--%>

<sec:authorize access="hasRole('ROLE_UNVERIFIED')">
<div class="alert alert-warning alert-dismissable">
    <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
    Your email id is unverified. <a href="/users/resend-verification-mail">Click here</a> to get the verification mail
    again.
</div>
</sec:authorize>

<c:if test="${not empty flashMessage}">
<div class="alert alert-${flashKind} alert-dismissable">
    <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
        ${flashMessage}
</div>
</c:if>
	